import { LandingRoute, landingMetadata } from "@/components/landing";

export const metadata = landingMetadata("b2b-and-wholesale");

export default function Page() {
  return <LandingRoute slug="b2b-and-wholesale" />;
}
