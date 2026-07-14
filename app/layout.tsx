import type { Metadata } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, Roboto } from "next/font/google";
import CookieConsent from "@/components/privacy/CookieConsent";
import "./globals.css";

import { GoogleTagManager } from "@next/third-parties/google";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

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
  metadataBase: new URL("https://imaginelabs.bodilum.com"),
  title: {
    default: "imaginelabs",
    template: "%s | imaginelabs",
  },
  description:
    "Cutting-edge, AI-literate learning for small businesses and future leaders—building practical skills in AI, coding, design, mathematics, and creative problem-solving.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script id="imaginelabs-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>
      </head>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      <body className={`${bricolageGrotesque.variable} ${roboto.variable}`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
