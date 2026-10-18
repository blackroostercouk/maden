/**
 * Declarative motion. Components opt in with data attributes; this file
 * maps each attribute to one GSAP behaviour. Nothing here hides content
 * before JavaScript runs, so the page is complete without it.
 *
 *   data-reveal="words"        heading words rise as it enters
 *   data-reveal="intro-words"  hero heading words, part of the intro
 *   data-intro="0.55"          hero element fades up at this time (s)
 *   data-intro-clip            hero photo frame opens from a clip
 *   data-reveal="stagger"      children (or [data-stagger-item]) rise in turn
 *   data-reveal="bars"         bar widths grow from zero
 *   data-reveal="ticks"        list items slide in one by one
 *   data-float-scope / data-float   cards rise when their panel enters
 *   data-parallax              image drifts slower than the page
 *   data-thread-scope / data-thread line draws while scrolling
 *   data-count-to="2940"       number counts up once
 *   data-scrub="lift"          element lifts as its section scrolls in
 *   data-pointer-scope / data-depth  cards drift with the pointer
 */
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import { mediaQuery } from "@/design/breakpoints";
import { duration, ease, revealStart, stagger } from "@/design/motion";

type Gsap = typeof GsapType;
type Cleanup = () => void;

const all = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T & Element>(selector)) as T[];

export function registerAnimations(gsap: Gsap, ScrollTrigger: typeof ScrollTriggerType) {
  const cleanups: Cleanup[] = [];

  /* Hero intro ------------------------------------------------- */
  const intro = gsap.timeline({ defaults: { ease: ease.out } });
  intro.from(
    all('[data-reveal="intro-words"] [data-word]'),
    {
      yPercent: 110,
      duration: duration.slower,
      stagger: stagger.heroWords,
    },
    0.15,
  );
  all("[data-intro]").forEach((element) => {
    const at = Number(element.dataset.intro) || 0.5;
    intro.from(element, { y: 18, autoAlpha: 0, duration: duration.base }, at);
  });
  all("[data-intro-clip]").forEach((element) => {
    intro.fromTo(
      element,
      { clipPath: "inset(14% 0% 0% 0% round 6px)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 6px)",
        duration: duration.intro,
        ease: ease.inOut,
        clearProps: "clipPath",
      },
      0.1,
    );
  });

  /* Scroll reveals --------------------------------------------- */
  all('[data-reveal="words"]').forEach((heading) => {
    gsap.from(all("[data-word]", heading), {
      yPercent: 110,
      duration: duration.slow,
      ease: ease.out,
      stagger: stagger.words,
      scrollTrigger: { trigger: heading, start: revealStart.early, once: true },
    });
  });

  all('[data-reveal="stagger"]').forEach((group) => {
    const marked = all("[data-stagger-item]", group);
    const targets = marked.length > 0 ? marked : (Array.from(group.children) as HTMLElement[]);
    gsap.from(targets, {
      y: 22,
      autoAlpha: 0,
      duration: duration.base,
      ease: ease.soft,
      stagger: marked.length > 0 ? stagger.rows : 0.06,
      scrollTrigger: { trigger: group, start: revealStart.early, once: true },
    });
  });

  all('[data-reveal="bars"]').forEach((chart) => {
    gsap.from(all("i", chart), {
      scaleX: 0,
      transformOrigin: "left",
      duration: 1,
      ease: ease.soft,
      stagger: stagger.items,
      scrollTrigger: { trigger: chart, start: "top 82%", once: true },
    });
  });

  all('[data-reveal="ticks"]').forEach((list) => {
    gsap.from(all("li", list), {
      x: -14,
      autoAlpha: 0,
      duration: duration.fast,
      ease: ease.soft,
      stagger: 0.14,
      scrollTrigger: { trigger: list, start: revealStart.late, once: true },
    });
  });

  all("[data-float-scope]").forEach((scope) => {
    const cards = all("[data-float]", scope);
    if (cards.length === 0) return;
    gsap.from(cards, {
      y: 50,
      autoAlpha: 0,
      duration: 1.2,
      ease: ease.out,
      stagger: stagger.cards,
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
    });
  });

  /* Scrubbed ---------------------------------------------------- */
  all("[data-parallax]").forEach((image) => {
    const frame = image.parentElement;
    gsap.fromTo(
      image,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: ease.linear,
        scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });

  all("[data-thread-scope]").forEach((scope) => {
    const line = scope.querySelector("[data-thread]");
    if (!line) return;
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: ease.linear,
        scrollTrigger: { trigger: scope, start: "top 70%", end: "bottom 60%", scrub: true },
      },
    );
  });

  all('[data-scrub="lift"]').forEach((element) => {
    gsap.from(element, {
      yPercent: 30,
      ease: ease.linear,
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
      },
    });
  });

  all("[data-count-to]").forEach((element) => {
    const target = Number(element.dataset.countTo) || 0;
    const prefix = element.dataset.countPrefix ?? "";
    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: duration.intro,
      ease: "power2.out",
      scrollTrigger: { trigger: element, start: revealStart.default, once: true },
      onUpdate: () => {
        element.textContent = `${prefix}${Math.round(counter.value).toLocaleString("en-GB")}`;
      },
    });
  });

  /* Pointer drift (fine pointers only, resets on leave) ---------- */
  if (window.matchMedia(mediaQuery.finePointer).matches) {
    all("[data-pointer-scope]").forEach((scope) => {
      const cards = all("[data-depth]", scope).map((element) => ({
        depth: Number(element.dataset.depth) || 0,
        x: gsap.quickTo(element, "x", { duration: 0.9, ease: "power3" }),
        y: gsap.quickTo(element, "y", { duration: 0.9, ease: "power3" }),
      }));
      if (cards.length === 0) return;
      const move = (event: PointerEvent) => {
        const rect = scope.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        cards.forEach((card) => {
          card.x(nx * 18 * card.depth);
          card.y(ny * 14 * card.depth);
        });
      };
      const reset = () => cards.forEach((card) => (card.x(0), card.y(0)));
      scope.addEventListener("pointermove", move, { passive: true });
      scope.addEventListener("pointerleave", reset);
      window.addEventListener("blur", reset);
      cleanups.push(() => {
        scope.removeEventListener("pointermove", move);
        scope.removeEventListener("pointerleave", reset);
        window.removeEventListener("blur", reset);
      });
    });
  }

  /* Re-measure once fonts and images settle ---------------------- */
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  window.addEventListener("load", refresh);
  cleanups.push(() => window.removeEventListener("load", refresh));

  return () => cleanups.forEach((fn) => fn());
}
