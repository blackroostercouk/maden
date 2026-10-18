import { MotionStart } from "@/components/motion";
import { Enquiry } from "@/components/sections";
import { Section, SectionHeader } from "@/components/ui";
import { productCopy } from "@/content/products";
import { ProductCards } from "./ProductCards";

export function ProductsIndex() {
  return (
    <>
      <Section labelledBy="products-title">
        <SectionHeader
          eyebrow={productCopy.indexEyebrow}
          title={productCopy.indexTitle}
          titleId="products-title"
          intro={productCopy.indexIntro}
        />
        <ProductCards />
      </Section>
      <Enquiry />
      <MotionStart />
    </>
  );
}
