import type { Metadata } from "next";
import { productCopy, products, type Product, type ProductSlug } from "@/content/products";
import { brand } from "@/content/site";
import { ProductPage } from "./ProductPage";

export function productMetadata(slug: ProductSlug): Metadata {
  const product = products[slug];
  const title = `${product.metaTitle} | ${brand.legalName}`;
  return {
    title,
    description: product.metaDescription,
    openGraph: { title, description: product.metaDescription, type: "website" },
  };
}

export const productsMetadata: Metadata = {
  title: `${productCopy.indexMetaTitle} | ${brand.legalName}`,
  description: productCopy.indexMetaDescription,
};

function structuredData(product: Product) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `${product.name} for Shopify`,
      description: product.metaDescription,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Shopify",
      provider: { "@type": "Organization", name: brand.legalName },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: product.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];
}

export function ProductRoute({ slug }: { slug: ProductSlug }) {
  const product = products[slug];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(product)).replace(/</g, "\\u003c"),
        }}
      />
      <ProductPage product={product} />
    </>
  );
}
