"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { WeaveCanvas } from "@/components/motion";
import { Backdrop } from "@/components/ui";
import type { Report } from "@/lib/analyse/report";
import { STEPS, normaliseUrl, notices, type NoticeCode } from "./helpers";
import { ReportView } from "./ReportView";
import "./intelligence.css";

type View =
  | { name: "idle" }
  | { name: "progress"; host: string }
  | { name: "notice"; host: string; code: NoticeCode }
  | { name: "report"; report: Report };

class AnalysisError extends Error {
  constructor(readonly code: NoticeCode) {
    super(code);
  }
}

async function analyseStore(host: string): Promise<Report> {
  let response: Response;
  try {
    response = await fetch("/api/analyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: host }),
    });
  } catch {
    throw new AnalysisError("unreachable");
  }
  if (response.status === 429) throw new AnalysisError("busy");
  let body: { ok: boolean; code?: NoticeCode; report?: Report };
  try {
    body = await response.json();
  } catch {
    throw new AnalysisError("unreachable");
  }
  if (!body.ok || !body.report) throw new AnalysisError(body.code ?? "unreachable");
  return body.report;
}

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
);

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const detects = [
  "Products and variants",
  "Collections",
  "Shopify or not",
  "Plus signals",
  "Theme",
  "Apps and pixels",
  "Markets and currencies",
  "Script weight",
];

/** The store intelligence page: a search, the wait while it runs, and the report. */
export function Intelligence() {
  const [view, setView] = useState<View>({ name: "idle" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [tip, setTip] = useState<{ title: string; text: string; x: number; top: number } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<HTMLElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const scrollTo = (el: HTMLElement | null) =>
    el?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });

  const startProgress = (host: string) => {
    setView({ name: "progress", host });
    let i = 0;
    const advance = () => {
      setStep(i);
      if (i < STEPS.length) {
        i += 1;
        timer.current = setTimeout(advance, reduced() ? 40 : 650);
      }
    };
    advance();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const target = normaliseUrl(inputRef.current?.value ?? "");
    if ("error" in target) {
      setError(target.error);
      inputRef.current?.focus();
      return;
    }
    if (inputRef.current) inputRef.current.value = target.host;
    setError("");
    setBusy(true);
    startProgress(target.host);
    requestAnimationFrame(() => scrollTo(progressRef.current));
    try {
      const report = await analyseStore(target.host);
      clearTimeout(timer.current);
      setStep(STEPS.length);
      await new Promise((resolve) => setTimeout(resolve, reduced() ? 0 : 450));
      setView({ name: "report", report });
    } catch (err) {
      clearTimeout(timer.current);
      setView({
        name: "notice",
        host: target.host,
        code: err instanceof AnalysisError ? err.code : "unreachable",
      });
    } finally {
      setBusy(false);
    }
  };

  // Bring the new view into sight and move focus to it
  useEffect(() => {
    if (view.name === "report") {
      scrollTo(reportRef.current);
      reportRef.current?.querySelector<HTMLElement>("#reportTitle")?.focus({ preventScroll: true });
    } else if (view.name === "notice") {
      noticeRef.current?.focus({ preventScroll: true });
      scrollTo(noticeRef.current?.parentElement ?? null);
    }
  }, [view.name]);

  const retry = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" });
  }, []);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Sub-navigation highlight and reveal-on-scroll, once a report is on screen
  useEffect(() => {
    const root = reportRef.current;
    if (view.name !== "report" || !root) return;
    const links = [...root.querySelectorAll<HTMLAnchorElement>(".subnav a")];
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
        }),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    root.querySelectorAll(".r-sec").forEach((sec) => spy.observe(sec));

    let reveal: IntersectionObserver | undefined;
    if (!reduced()) {
      const items = [...root.querySelectorAll(".reveal")];
      items.forEach((el) => el.classList.add("pre"));
      reveal = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.remove("pre");
              reveal?.unobserve(e.target);
            }
          }),
        { rootMargin: "0px 0px -8% 0px" },
      );
      items.forEach((el) => reveal?.observe(el));
    }
    return () => {
      spy.disconnect();
      reveal?.disconnect();
    };
  }, [view]);

  // Tooltips for chart marks, read from data attributes
  useEffect(() => {
    const show = (el: HTMLElement) => {
      const rect = (el.querySelector(".fill") ?? el).getBoundingClientRect();
      const x = el.classList.contains("bar") ? rect.right : rect.left + rect.width / 2;
      setTip({
        title: el.dataset.tipTitle ?? "",
        text: el.dataset.tipText ?? "",
        x: Math.min(Math.max(x, 80), window.innerWidth - 80),
        top: rect.top,
      });
    };
    const target = (e: Event) => (e.target as Element | null)?.closest<HTMLElement>("[data-tip-title]");
    const over = (e: Event) => {
      const el = target(e);
      if (el) show(el);
    };
    const out = (e: Event) => {
      if (target(e)) setTip(null);
    };
    const focusin = (e: Event) => {
      const el = target(e);
      if (el) show(el);
      else setTip(null);
    };
    const hide = () => setTip(null);
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    document.addEventListener("focusin", focusin);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("focusin", focusin);
      window.removeEventListener("scroll", hide);
    };
  }, []);

  const notice = view.name === "notice" ? (notices[view.code] ?? notices.unreachable)(view.host) : null;
  const report = view.name === "report" ? view.report : null;
  const apps = report?.apps.length ?? 0;

  return (
    <div className="intel">
      <section className="hero" aria-labelledby="heroTitle" data-pointer-scope>
        <Backdrop pattern="weave" />
        <WeaveCanvas />
        <div className="container">
          <div className="hero-inner">
            <p className="eyebrow">Store intelligence</p>
            <h1 id="heroTitle" className="h-display h-3xl">
              <span className="line">See how any Shopify</span>
              <span className="line accent italic">store is cut.</span>
            </h1>
            <p className="lede">
              Enter a store address. We read its public storefront and report the catalogue, the collections,
              the plan it&apos;s likely on and every app we can find.
            </p>

            <form className={`search${error ? " invalid" : ""}`} onSubmit={submit} noValidate>
              <label className="search-label" htmlFor="storeUrl">
                Store address
              </label>
              <div className="search-row">
                <span className="search-prefix" aria-hidden="true">
                  https://
                </span>
                <input
                  ref={inputRef}
                  className="search-input"
                  id="storeUrl"
                  name="url"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  spellCheck={false}
                  autoCapitalize="off"
                  placeholder="yourcompetitor.com"
                  aria-describedby="searchHelp searchError"
                  aria-invalid={error ? true : undefined}
                  required
                  onChange={() => error && setError("")}
                  onPaste={() =>
                    setTimeout(() => {
                      if (inputRef.current)
                        inputRef.current.value = inputRef.current.value.trim().replace(/^https?:\/\//i, "");
                    })
                  }
                />
                <button className="btn" type="submit" disabled={busy}>
                  {busy ? "Analysing… " : "Analyse store "}
                  <Arrow />
                </button>
              </div>
              <p className="search-error" id="searchError" role="alert">
                {error}
              </p>
              <div className="search-help" id="searchHelp">
                <span>
                  Press <kbd>Enter</kbd> to analyse. Public storefront data only, nothing behind a login.
                </span>
                <span>Takes about ten seconds</span>
              </div>
            </form>

            <ul className="detects" aria-label="What the report covers">
              {detects.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="progress" ref={progressRef} aria-labelledby="progressTitle" hidden={view.name !== "progress"}>
        <div className="container progress-grid">
          <div style={{ display: "grid", gap: "var(--space-5)" }}>
            <p className="eyebrow">Analysing</p>
            <h2 className="h-display h-2xl" id="progressTitle">
              Reading{" "}
              <span className="accent italic">{view.name === "progress" ? view.host : "the store"}</span>
            </h2>
            <p className="muted measure">
              We fetch the storefront once, then read the public product and collection feeds. Nothing is stored
              about you or the store.
            </p>
          </div>
          <ol
            className="steps"
            aria-live="polite"
            style={{ "--p": Math.min(step / (STEPS.length - 1), 1) } as React.CSSProperties}
          >
            <span className="thread" aria-hidden="true" />
            {STEPS.map((s, n) => (
              <li
                className="step"
                key={s.label}
                data-state={n < step ? "done" : n === step ? "active" : "waiting"}
              >
                <span className="label">{s.label}</span>
                <span className="meta">{s.meta}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="notice" aria-live="polite" hidden={view.name !== "notice"}>
        <div className="container notice-card" tabIndex={-1} ref={noticeRef}>
          {notice && (
            <>
              <p className="eyebrow">{notice.eyebrow}</p>
              <h2 className="h-display h-2xl">{notice.title}</h2>
              <p className="muted measure">{notice.text}</p>
              <div className="actions">
                <button className="btn" type="button" onClick={retry}>
                  Try another store <Arrow />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <div ref={reportRef} hidden={view.name !== "report"}>
        {report && <ReportView key={report.analysedAt} report={report} onRetry={retry} onCopy={copy} />}
      </div>

      <section className="cta" aria-labelledby="ctaTitle">
        <div className="container cta-inner">
          <div style={{ display: "grid", gap: "var(--space-5)" }}>
            <p className="eyebrow">Made to measure</p>
            <h2 className="h-display h-2xl" id="ctaTitle">
              {report
                ? `${report.store.name} runs ${apps} ${apps === 1 ? "app" : "apps"}. What is yours missing?`
                : "Something your store needs that no app does?"}
            </h2>
            <p className="muted measure">
              {report
                ? "If something your store needs isn't in any of them, we build it as a private app for that one job: fixed price, loads only where it's used, and the code is yours."
                : "We build a private app for that one job: fixed price, loads only where it’s used, and the code is yours."}
            </p>
          </div>
          <div className="actions">
            <Link className="btn" href="/#enquire">
              Begin a conversation <Arrow />
            </Link>
            <button className="btn ghost" type="button" onClick={retry}>
              Analyse another store
            </button>
          </div>
        </div>
        <div className="container">
          <p className="fine">
            Store intelligence reads only public storefront data. Results are estimates; Shopify doesn&apos;t
            publish a store&apos;s plan or app list. Shopify and Shopify Plus are trademarks of Shopify Inc.
          </p>
        </div>
      </section>

      <div
        className="tip"
        role="presentation"
        hidden={!tip}
        style={tip ? { left: tip.x, top: tip.top } : undefined}
      >
        {tip && (
          <>
            <b>{tip.title}</b>
            <br />
            {tip.text}
          </>
        )}
      </div>
    </div>
  );
}
