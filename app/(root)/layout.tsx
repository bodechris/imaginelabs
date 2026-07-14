import type { Metadata } from "next";
import SiteLegalFooter from "@/components/legal/SiteLegalFooter";
import "./landing-overrides.css";

export const metadata: Metadata = {
  title: "AI Business Sprint — 1 August 2026 · R950",
  description:
    "A live practical AI workshop for small business owners. Leave with a business AI profile prompt, 30-day content plan, reply templates, sales follow-ups, a workflow, lead tracker, five on-brand AI images and a review-request setup.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "imaginelabs AI Business Sprint — 1 August 2026",
    description:
      "A live practical AI workshop for small business owners. R950. Limited seats.",
    url: "/",
    type: "website",
  },
};

export default function RootLandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <SiteLegalFooter />
    </>
  );
}
