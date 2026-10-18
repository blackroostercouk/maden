import type { Metadata } from "next";
import { Intelligence } from "@/components/intelligence/Intelligence";
import { MotionStart } from "@/components/motion";
import { brand } from "@/content/site";

const title = `Store Intelligence | ${brand.legalName}`;
const description =
  "Analyse any Shopify store: catalogue size, collections, theme, plan signals and the apps it runs.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/intelligence" },
  openGraph: { title, description, type: "website" },
};

export default function Page() {
  return (
    <>
      <Intelligence />
      <MotionStart />
    </>
  );
}
