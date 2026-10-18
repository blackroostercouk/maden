"use client";

import { reopenConsent } from "./consent";

/** A text button for the footer that brings the cookie choice back. */
export function CookieSettings({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={reopenConsent}>
      Cookie settings
    </button>
  );
}
