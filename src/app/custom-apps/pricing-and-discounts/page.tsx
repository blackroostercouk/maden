import { LandingRoute, landingMetadata } from "@/components/landing";

export const metadata = landingMetadata("pricing-and-discounts");

export default function Page() {
  return <LandingRoute slug="pricing-and-discounts" />;
}
