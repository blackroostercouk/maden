import { Button, Section, SectionHeader } from "@/components/ui";
import { ProductCards } from "@/components/product";
import { productCopy } from "@/content/products";

/** Home page: the four ready-made products, linking to their own pages. */
export function ReadyProducts() {
  return (
    <Section id="products" labelledBy="ready-title">
      <SectionHeader
        eyebrow={productCopy.indexEyebrow}
        title={productCopy.indexTitle}
        titleId="ready-title"
        intro={productCopy.indexIntro}
      />
      <ProductCards />
      <div style={{ marginTop: "var(--space-8)" }}>
        <Button href="/products" variant="ghost" withArrow>
          All products
        </Button>
      </div>
    </Section>
  );
}
