import { landingSlugs, landings } from "@/content/landings";
import { productSlugs, products } from "@/content/products";
import { brand, siteUrl } from "@/content/site";

/** A plain-text summary of the site for AI assistants, built from the same content as the pages. */
export function GET() {
  const lines = [
    `# ${brand.name}`,
    "",
    `> ${brand.description}`,
    "",
    "## Ready-made products",
    ...productSlugs.map((slug) => {
      const product = products[slug];
      return `- [${product.name}](${siteUrl}/products/${slug}): ${product.summary}`;
    }),
    "",
    "## Custom apps",
    ...landingSlugs.map((slug) => {
      const landing = landings[slug];
      return `- [${landing.name}](${siteUrl}/custom-apps/${slug}): ${landing.metaDescription}`;
    }),
    "",
    "## Tools",
    `- [Store intelligence](${siteUrl}/intelligence): analyse a Shopify store's theme, apps and setup.`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
