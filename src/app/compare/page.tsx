import type { Metadata } from "next";
import { Intelligence } from "@/components/intelligence/Intelligence";
import { MotionStart } from "@/components/motion";
import { brand } from "@/content/site";

const title = `Compare Shopify Stores | ${brand.legalName}`;
const description =
  "Compare your Shopify store with a competitor's: catalogue, apps, script weight and plan signals, with suggestions for the gaps worth closing.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/compare" },
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
