import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Roboto } from "next/font/google";

import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage-grotesque",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Imaginelabs — Future Creators",
    template: "%s | Imaginelabs",
  },
  description:
    "Live, project-based design, coding, mathematics and responsible AI programmes for young creators aged 8–17.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontStyles = {
    "--il-display": bricolageGrotesque.style.fontFamily,
    "--il-body": roboto.style.fontFamily,
    fontFamily: roboto.style.fontFamily,
  } as CSSProperties;

  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${roboto.variable}`}
    >
      <body
        className={`${bricolageGrotesque.variable} ${roboto.variable} ${roboto.className}`}
        style={fontStyles}
      >
        {children}
      </body>
    </html>
  );
}
