import { redirect } from "next/navigation";

export default function AiBusinessSprintLegacyPage() {
  // Keep one canonical registration and payment funnel so all analytics events
  // are emitted from the same implementation.
  redirect("/#register");
}
