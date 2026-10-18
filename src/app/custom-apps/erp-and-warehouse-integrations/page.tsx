import { LandingRoute, landingMetadata } from "@/components/landing";

export const metadata = landingMetadata("erp-and-warehouse-integrations");

export default function Page() {
  return <LandingRoute slug="erp-and-warehouse-integrations" />;
}
