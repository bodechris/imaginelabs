import type { Metadata } from "next";
import ProgrammePage from "../../_components/ProgrammePage";
import { programmes } from "../../_lib/programmes";
import { getPricingContext } from "../../_lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Creators",
  description:
    "Responsible, project-based AI literacy for ages 8–17 covering research, design, content, learning, code, verification and everyday problem-solving.",
};

export default async function AICreatorsPage() {
  const programme = programmes["ai-creators"];
  const pricing = await getPricingContext(programme.id);
  return <ProgrammePage programme={programme} pricing={pricing} />;
}
