import type { MetadataRoute } from "next";
import { landingSlugs } from "@/content/landings";
import { productSlugs } from "@/content/products";
import { siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/products",
    ...productSlugs.map((slug) => `/products/${slug}`),
    ...landingSlugs.map((slug) => `/custom-apps/${slug}`),
    "/compare",
  ];
  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
