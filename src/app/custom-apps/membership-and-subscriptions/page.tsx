import { LandingRoute, landingMetadata } from "@/components/landing";

export const metadata = landingMetadata("membership-and-subscriptions");

export default function Page() {
  return <LandingRoute slug="membership-and-subscriptions" />;
}
