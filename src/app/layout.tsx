import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { CookieBanner, GoogleAnalytics } from "@/components/analytics";
import { SiteFooter, SiteHeader } from "@/components/layout";
import { MotionProvider } from "@/components/motion";
import { brand, siteUrl } from "@/content/site";
import { bodoni, hanken, manrope } from "@/design/fonts";
import { themeColor } from "@/design/tokens";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: brand.title,
  description: brand.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: brand.name,
    locale: "en_GB",
    title: brand.title,
    description: brand.description,
  },
  twitter: { card: "summary_large_image", title: brand.title, description: brand.description },
};

const organisation = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.legalName,
    url: siteUrl,
    description: brand.description,
    logo: `${siteUrl}/icon.svg`,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: siteUrl,
  },
];

export const viewport: Viewport = {
  themeColor,
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${bodoni.variable} ${hanken.variable} ${manrope.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation).replace(/</g, "\\u003c") }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <MotionProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </MotionProvider>
        <GoogleAnalytics />
        <CookieBanner />
      </body>
    </html>
  );
}
