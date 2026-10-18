"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Button, Container } from "@/components/ui";
import { brand, navigation, primaryCta } from "@/content/site";
import { cx } from "@/lib/cx";
import styles from "./SiteHeader.module.css";

/** Sticky header with the full nav on wide screens and a menu on small ones. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
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

  return (
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
      <Container>
        <nav id={menuId} className={styles.mobileNav} aria-label="Mobile" hidden={!open}>
          {[...navigation, primaryCta].map((link) => (
            <a key={link.href} href={resolve(link.href)} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  );
}
