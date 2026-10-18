import { MotionStart } from "@/components/motion";
import {
  AiFeatures,
  Build,
  Craft,
  Enquiry,
  Handover,
  Hero,
  Plans,
  Process,
  ReadyProducts,
  Statement,
  WhyCustom,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement />
      <WhyCustom />
      <Build />
      <AiFeatures />
      <ReadyProducts />
      <Plans />
      <Process />
      <Craft />
      <Handover />
      <Enquiry />
      <MotionStart />
    </>
  );
}
