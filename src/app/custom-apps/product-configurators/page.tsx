import { LandingRoute, landingMetadata } from "@/components/landing";

export const metadata = landingMetadata("product-configurators");

export default function Page() {
  return <LandingRoute slug="product-configurators" />;
}
