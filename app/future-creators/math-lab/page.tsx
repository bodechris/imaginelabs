import type { Metadata } from "next";
import ProgrammePage from "../../_components/ProgrammePage";
import { programmes } from "../../_lib/programmes";
import { getPricingContext } from "../../_lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Math Lab",
  description:
    "Online and selected Johannesburg in-person maths support for ages 8–17, combining strong foundations, visual teaching and practical projects.",
};

export default async function MathLabPage() {
  const programme = programmes["math-lab"];
  const pricing = await getPricingContext(programme.id);
  return <ProgrammePage programme={programme} pricing={pricing} />;
}
