"use client";

import { useEffect, useRef } from "react";
import { mediaQuery } from "@/design/breakpoints";
import { readToken } from "@/design/tokens";
import { cx } from "@/lib/cx";
import styles from "./WeaveCanvas.module.css";
import { weaveFragmentShader, weaveVertexShader } from "./weaveShaders";

const THREADS = 84;
const SEGMENTS = 150;
const SIZE = 7.2;
const MAX_PIXEL_RATIO = 1.75;

type WeaveCanvasProps = {
  /** Extra class for the host. Pointer and scroll are read from the parent element. */
  className?: string;
};

/**
 * The hero's woven cloth, drawn with three.js. It has one job: react to
 * the pointer and tighten as the page scrolls. It never renders under
 * reduced motion or without WebGL, leaving the static backdrop visible.
 */
export function WeaveCanvas({ className }: WeaveCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const scope = host?.parentElement;
    if (!host || !scope || window.matchMedia(mediaQuery.reducedMotion).matches) return;

    let disposed = false;
    let dispose: () => void = () => {};

    void import("three").then((THREE) => {
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
      const cameraBase = new THREE.Vector3(1.1, -4.2, 3.1);
      camera.position.copy(cameraBase);
      camera.lookAt(1.1, 0.4, 0);

      // Warp and weft threads as short line segments
      const half = SIZE / 2;
      const vertexCount = 2 * THREADS * SEGMENTS * 2;
      const positions = new Float32Array(vertexCount * 3);
      const direction = new Float32Array(vertexCount);
      const index = new Float32Array(vertexCount);
      let v = 0;
      const push = (x: number, y: number, d: number, i: number) => {
        positions[v * 3] = x;
        positions[v * 3 + 1] = y;
        direction[v] = d;
        index[v] = i;
        v++;
      };
      for (let d = 0; d < 2; d++) {
        for (let i = 0; i < THREADS; i++) {
          const c = -half + ((i + 0.5) * SIZE) / THREADS;
          for (let s = 0; s < SEGMENTS; s++) {
            const a = -half + (s * SIZE) / SEGMENTS;
            const b = -half + ((s + 1) * SIZE) / SEGMENTS;
            if (d === 0) {
              push(c, a, 0, i);
              push(c, b, 0, i);
            } else {
              push(a, c, 1, i);
              push(b, c, 1, i);
            }
          }
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aDir", new THREE.BufferAttribute(direction, 1));
      geometry.setAttribute("aIdx", new THREE.BufferAttribute(index, 1));

      const uniforms = {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uPointer: { value: new THREE.Vector2(9, 9) },
        uPull: { value: 0 },
        uDeep: { value: new THREE.Color(readToken("--color-weave-deep")) },
        uLight: { value: new THREE.Color(readToken("--color-weave-light")) },
        uThreads: { value: THREADS },
        uSize: { value: SIZE },
      };
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: weaveVertexShader,
        fragmentShader: weaveFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.LineSegments(geometry, material);
      mesh.rotation.z = -0.16;
      scene.add(mesh);

      // Pointer, projected onto the cloth plane, applied once per frame
      const raycaster = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const hit = new THREE.Vector3();
      const inverse = new THREE.Matrix4();
      const target = new THREE.Vector2(9, 9);
      let pullTarget = 0;
      let pending: PointerEvent | null = null;
      const onMove = (event: PointerEvent) => (pending = event);
      const release = () => (pullTarget = 0);
      const applyPointer = () => {
        if (!pending) return;
        const rect = host.getBoundingClientRect();
        ndc.set(
          ((pending.clientX - rect.left) / rect.width) * 2 - 1,
          -((pending.clientY - rect.top) / rect.height) * 2 + 1,
        );
        raycaster.setFromCamera(ndc, camera);
        if (raycaster.ray.intersectPlane(plane, hit)) {
          inverse.copy(mesh.matrixWorld).invert();
          hit.applyMatrix4(inverse);
          target.set(hit.x, hit.y);
          pullTarget = 1;
        }
        pending = null;
      };
      scope.addEventListener("pointermove", onMove, { passive: true });
      scope.addEventListener("pointerleave", release);
      window.addEventListener("blur", release);

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = host;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.fov = w < 700 ? 46 : 34;
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();

      let frameId = 0;
      let running = false;
      let onScreen = true;
      let last = performance.now();
      let time = 0;
      const frame = (now: number) => {
        frameId = requestAnimationFrame(frame);
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        time += dt;
        applyPointer();
        const rect = scope.getBoundingClientRect();
        uniforms.uScroll.value = Math.min(Math.max(-rect.top / rect.height, 0), 1);
        uniforms.uTime.value = time;
        uniforms.uPointer.value.lerp(target, 0.08);
        uniforms.uPull.value += (pullTarget - uniforms.uPull.value) * 0.05;
        camera.position.x = cameraBase.x + uniforms.uPointer.value.x * 0.03 * uniforms.uPull.value;
        camera.position.z = cameraBase.z - uniforms.uScroll.value * 0.6;
        camera.lookAt(1.1, 0.4, 0);
        renderer.render(scene, camera);
      };
      const start = () => {
        if (running || document.hidden || !onScreen) return;
        running = true;
        last = performance.now();
        frameId = requestAnimationFrame(frame);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(frameId);
      };
      const intersection = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      });
      intersection.observe(scope);
      const onVisibility = () => {
        if (document.hidden) {
          stop();
          release();
        } else start();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const canvas = renderer.domElement;
      const onLost = (event: Event) => {
        event.preventDefault();
        stop();
        host.classList.remove(styles.live);
      };
      const onRestored = () => {
        host.classList.add(styles.live);
        start();
      };
      canvas.addEventListener("webglcontextlost", onLost);
      canvas.addEventListener("webglcontextrestored", onRestored);

      start();
      requestAnimationFrame(() => host.classList.add(styles.live));

      dispose = () => {
        stop();
        intersection.disconnect();
        resizeObserver.disconnect();
        scope.removeEventListener("pointermove", onMove);
        scope.removeEventListener("pointerleave", release);
        window.removeEventListener("blur", release);
        document.removeEventListener("visibilitychange", onVisibility);
        canvas.removeEventListener("webglcontextlost", onLost);
        canvas.removeEventListener("webglcontextrestored", onRestored);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        canvas.remove();
      };
    });

    return () => {
      disposed = true;
      dispose();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className={cx(styles.host, className)} />;
}
