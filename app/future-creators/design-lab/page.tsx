import type { Metadata } from "next";
import ProgrammePage from "../../_components/ProgrammePage";
import { programmes } from "../../_lib/programmes";
import { getPricingContext } from "../../_lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Design Lab",
  description:
    "Live online design classes for ages 8–17 using Figma, design principles and age-appropriate vector workflows to create portfolio-ready projects.",
};

export default async function DesignLabPage() {
  const programme = programmes["design-lab"];
  const pricing = await getPricingContext(programme.id);
  return <ProgrammePage programme={programme} pricing={pricing} />;
}
