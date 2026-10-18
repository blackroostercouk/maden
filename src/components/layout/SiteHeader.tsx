"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Button, Container } from "@/components/ui";
import { brand, navigation, primaryCta } from "@/content/site";
import { cx } from "@/lib/cx";
import styles from "./SiteHeader.module.css";

/** Sticky header with the full nav on wide screens and a menu on small ones. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  // Section links live on the home page; from other pages they lead back to it.
  // The enquiry form is on every page, so that link stays local.
  const onHome = pathname === "/";
  const resolve = (href: string) =>
    !onHome && href.startsWith("#") && href !== "#enquire" ? `/${href}` : href;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onNavigate = () => setOpen(false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("moden:navigate", onNavigate);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("moden:navigate", onNavigate);
    };
  }, []);

  // Freeze the page behind the open menu and put focus inside it
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <header id="top" className={cx(styles.header, scrolled && styles.scrolled)}>
      <Container className={styles.row}>
        <a
          className={styles.mark}
          href={onHome ? "#top" : "/"}
          aria-label={`${brand.name}, back to top`}
        >
          <span className={styles.wordmark}>
            {brand.name.toLowerCase()}
            <i className={styles.stop} aria-hidden="true" />
          </span>{" "}
          <small className={styles.descriptor}>{brand.descriptor}</small>
        </a>
        <nav className={styles.nav} aria-label="Main">
          {navigation.map((link) => (
            <a key={link.href} href={resolve(link.href)} className={styles.link}>
              {link.short ?? link.label}
            </a>
          ))}
          <Button href={resolve(primaryCta.href)} size="sm" className={styles.cta}>
            {primaryCta.label}
          </Button>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </Container>
    </header>
      <div
        id={menuId}
        className={cx(styles.menu, open && styles.menuOpen)}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-lenis-prevent
        inert={!open}
      >
        <div className={styles.menuBar}>
          <a className={styles.mark} href={onHome ? "#top" : "/"} onClick={() => setOpen(false)}>
            <span className={styles.wordmark}>
              {brand.name.toLowerCase()}
              <i className={styles.stop} aria-hidden="true" />
            </span>
          </a>
          <button ref={closeRef} type="button" className={styles.menuButton} onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <nav className={styles.menuNav} aria-label="Mobile">
          <ol>
            {navigation.map((link, index) => (
              <li key={link.href} style={{ "--i": index } as CSSProperties}>
                <a href={resolve(link.href)} onClick={() => setOpen(false)}>
                  <span className={styles.menuIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{link.label}</span>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <path d="M2 8h11M9 4l4 4-4 4" />
                  </svg>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.menuFoot} style={{ "--i": navigation.length } as CSSProperties}>
          <Button href={resolve(primaryCta.href)} withArrow onClick={() => setOpen(false)}>
            {primaryCta.label}
          </Button>
          <p>{brand.descriptor}</p>
        </div>
      </div>
    </>
  );
}
