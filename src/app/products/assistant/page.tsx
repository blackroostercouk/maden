import { ProductRoute, productMetadata } from "@/components/product";

export const metadata = productMetadata("assistant");

export default function Page() {
  return <ProductRoute slug="assistant" />;
}
