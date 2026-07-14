import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Business Sprint | imaginelabs",
  description:
    "A practical AI workshop for small businesses covering content, customer replies, workflows and brand visuals.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      <body>{children}</body>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
    </html>
  );
}
