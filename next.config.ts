import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy without nonces, so the home page stays static.
 * 'unsafe-inline' scripts are needed for Next's inline payload; dev also
 * needs eval (React debugging) and websockets (hot reload).
 * `extra` adds the few outside origins a page is allowed to use.
 */
// Google Analytics: its script, the beacons it sends, and its tracking pixel
const analytics = {
  script: "https://www.googletagmanager.com",
  connect: "https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  img: "https://*.google-analytics.com https://*.googletagmanager.com",
};

const policy = (extra: { script?: string; img?: string } = {}) =>
  [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${analytics.script}${extra.script ? ` ${extra.script}` : ""}${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' blob: data: ${analytics.img}${extra.img ? ` ${extra.img}` : ""}`,
    "font-src 'self'",
    `connect-src 'self' ${analytics.connect}${isDev ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

const securityHeaders = (contentSecurityPolicy: string) => [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/intelligence", destination: "/compare", permanent: true }];
  },
  async headers() {
    return [
      { source: "/((?!compare$).*)", headers: securityHeaders(policy()) },
      {
        // The report shows product photos from Shopify's image host
        source: "/compare",
        headers: securityHeaders(policy({ img: "https://cdn.shopify.com" })),
      },
    ];
  },
};

export default nextConfig;
