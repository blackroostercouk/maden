import { ProductRoute, productMetadata } from "@/components/product";

export const metadata = productMetadata("gifts");

export default function Page() {
  return <ProductRoute slug="gifts" />;
}
