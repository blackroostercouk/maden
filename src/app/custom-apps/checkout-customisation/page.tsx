import { LandingRoute, landingMetadata } from "@/components/landing";

export const metadata = landingMetadata("checkout-customisation");

export default function Page() {
  return <LandingRoute slug="checkout-customisation" />;
}
