import type { Metadata } from "next";
import ProgrammePage from "../../_components/ProgrammePage";
import { programmes } from "../../_lib/programmes";
import { getPricingContext } from "../../_lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Design + Coding",
  description:
    "Project-based online design and coding classes for children aged 8–17, covering games, web development, AI, visual design and digital fluency.",
};

export default async function DesignCodingPage() {
  const programme = programmes["design-coding"];
  const pricing = await getPricingContext(programme.id);
  return <ProgrammePage programme={programme} pricing={pricing} />;
}
