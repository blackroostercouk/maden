import { ProductRoute, productMetadata } from "@/components/product";

export const metadata = productMetadata("favourites");

export default function Page() {
  return <ProductRoute slug="favourites" />;
}
