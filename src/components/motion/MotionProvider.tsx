"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { mediaQuery } from "@/design/breakpoints";
import { smoothScroll } from "@/design/motion";

type ScrollTo = (target: HTMLElement | number, onArrive: () => void) => void;

/**
 * Handle in-page links with the active scroll engine.
 * Fires "moden:navigate" on click and "moden:arrive" once the
 * scroll has finished, both with { hash } as detail.
 */
function bindAnchorLinks(scrollTo: ScrollTo) {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href") ?? "";
    const target = hash === "#top" ? null : document.getElementById(hash.slice(1));
    if (hash !== "#top" && !target) return;
    event.preventDefault();
    const detail = { hash };
    scrollTo(target ?? 0, () => window.dispatchEvent(new CustomEvent("moden:arrive", { detail })));
    history.replaceState(null, "", hash);
    window.dispatchEvent(new CustomEvent("moden:navigate", { detail }));
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

const MarkPageReady = createContext<() => void>(() => {});

/**
 * Starts smooth scrolling (Lenis, the only scroll engine) and the GSAP
 * motion layer once the page is interactive. Under reduced motion it
 * does nothing except native in-page links.
 *
 * The page segment hydrates after this layout, so the motion layer waits
 * for <MotionStart /> at the end of the page: GSAP writing styles into
 * markup React has not hydrated yet would cause a hydration mismatch.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [pageReady, setPageReady] = useState(false);
  const markPageReady = useCallback(() => setPageReady(true), []);

  useEffect(() => {
    if (!pageReady) return;
    const reduced = window.matchMedia(mediaQuery.reducedMotion).matches;
    let cleanup: () => void = () => {};
    let cancelled = false;

    if (reduced) {
      cleanup = bindAnchorLinks((target, onArrive) => {
        if (typeof target === "number") window.scrollTo({ top: target });
        else target.scrollIntoView({ block: "start" });
        onArrive();
      });
      return () => cleanup();
    }

    void (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }, { registerAnimations }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("lenis"),
          import("./animations"),
        ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: smoothScroll.duration,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const unbindLinks = bindAnchorLinks((target, onArrive) =>
        lenis.scrollTo(target, {
          offset: typeof target === "number" ? 0 : smoothScroll.headerOffset,
          onComplete: onArrive,
        }),
      );

      let disposeAnimations: () => void = () => {};
      const context = gsap.context(() => {
        disposeAnimations = registerAnimations(gsap, ScrollTrigger);
      }, document.body);

      cleanup = () => {
        disposeAnimations();
        context.revert();
        unbindLinks();
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [pageReady]);

  return <MarkPageReady value={markPageReady}>{children}</MarkPageReady>;
}

/** Render once, as the last element of every page, to start the motion layer. */
export function MotionStart() {
  const markPageReady = useContext(MarkPageReady);
  useEffect(markPageReady, [markPageReady]);
  return null;
}
