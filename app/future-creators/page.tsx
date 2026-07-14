import type { Metadata } from "next";
import FutureCreatorsOverview from "../_components/FutureCreatorsOverview";
import { programmeOrder, programmes } from "../_lib/programmes";
import { getPricingContext } from "../_lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Future Creators",
  description:
    "Live online design, coding, maths and responsible AI programmes for young creators aged 8–17 in South Africa, Nigeria and selected international time zones.",
};

export default async function FutureCreatorsPage() {
  const pricing = await Promise.all(
    programmeOrder.map((programmeId) => getPricingContext(programmeId)),
  );

  return (
    <FutureCreatorsOverview
      items={programmeOrder.map((programmeId, index) => ({
        programme: programmes[programmeId],
        pricing: pricing[index],
      }))}
    />
  );
}
