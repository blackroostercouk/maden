import type { Metadata } from "next";
import { landings, type Landing, type LandingSlug } from "@/content/landings";
import { brand } from "@/content/site";
import { LandingPage } from "./LandingPage";

/** Page metadata for /custom-apps/<slug>. */
export function landingMetadata(slug: LandingSlug): Metadata {
  const landing = landings[slug];
  const title = `${landing.metaTitle} | ${brand.legalName}`;
  return {
    title,
    description: landing.metaDescription,
    openGraph: { title, description: landing.metaDescription, type: "website" },
  };
}

/** Tells search engines what the page offers and which questions it answers. */
function structuredData(landing: Landing) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: landing.metaTitle,
      description: landing.metaDescription,
      serviceType: "Custom Shopify app development",
      provider: { "@type": "Organization", name: brand.legalName },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: landing.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];
}

/** The body of a /custom-apps/<slug> page: structured data plus the landing page itself. */
export function LandingRoute({ slug }: { slug: LandingSlug }) {
  const landing = landings[slug];
  return (
    <>
      <script
        type="application/ld+json"
        // Static copy from our own content file; "<" is escaped so it can never close the tag
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(landing)).replace(/</g, "\\u003c"),
        }}
      />
      <LandingPage landing={landing} />
    </>
  );
}
