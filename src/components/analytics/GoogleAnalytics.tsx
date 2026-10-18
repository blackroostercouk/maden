"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { readConsent, subscribe } from "./consent";

const MEASUREMENT_ID = "G-HGFZ6N8783";

/** Google Analytics 4. Loads only in production and only after the visitor accepts cookies. */
export function GoogleAnalytics() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => null);
  if (process.env.NODE_ENV !== "production" || consent !== "granted") return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
