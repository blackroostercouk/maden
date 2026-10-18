import { ProductRoute, productMetadata } from "@/components/product";

export const metadata = productMetadata("membership");

export default function Page() {
  return <ProductRoute slug="membership" />;
}
