import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteLegalFooter from "@/components/legal/SiteLegalFooter";
import CookieSettingsButton from "@/components/privacy/CookieSettingsButton";
import styles from "../legal-pages.module.css";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How imaginelabs uses essential storage, analytics cookies and advertising technologies, and how visitors can control them.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <main className={styles.page}>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <Link
              href="/"
              className={styles.brand}
              aria-label="imaginelabs home"
            >
              <Image
                src="/images/logo-horizontal.svg"
                alt="imaginelabs"
                width={896}
                height={177}
                priority
                className={styles.brandLogo}
              />
            </Link>
            <Link href="/" className={styles.back}>
              Back to AI Business Sprint
            </Link>
          </nav>
          <p className={styles.eyebrow}>Legal / cookies</p>
          <h1 className={styles.title}>Cookie Policy</h1>
          <p className={styles.updated}>Last updated: 14 July 2026</p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.aside}>
            <strong>Your choices</strong>
            <span>
              Essential storage remains active because it is required for core
              website functions. Analytics and marketing tools remain disabled
              until you allow them.
            </span>
            <CookieSettingsButton className={styles.settingsButton} />
            <Link href="/privacy">Read the Privacy Policy</Link>
          </aside>

          <article className={styles.content}>
            <section className={styles.section}>
              <h2>1. What cookies and similar technologies are</h2>
              <p>
                Cookies are small data files stored by a website or service in
                your browser. We may also use similar browser technologies,
                including local storage, pixels and consent signals. They can
                support core website functions, remember choices, measure use or
                help assess advertising performance.
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. Essential storage</h2>
              <p>
                Essential storage supports functions that are necessary for the
                website to operate and cannot be switched off through the
                consent banner. This includes remembering your cookie preference,
                maintaining website security and enabling forms and page
                navigation.
              </p>
              <ul>
                <li>
                  <strong>Consent preference:</strong> records whether you
                  accepted, rejected or customised optional tracking.
                </li>
                <li>
                  <strong>Security and reliability:</strong> may be used by our
                  hosting or infrastructure providers to prevent abuse and keep
                  the website available.
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>3. Analytics technologies</h2>
              <p>
                When you allow analytics, we may use Google Analytics or similar
                measurement tools to understand page visits, general traffic
                sources, device categories and interactions such as registration
                starts or completed purchases. We use this information to improve
                the landing page and class experience.
              </p>
              <p>
                Analytics storage is denied by default and should be enabled only
                after your consent choice is received.
              </p>
            </section>

            <section className={styles.section}>
              <h2>4. Marketing and advertising technologies</h2>
              <p>
                When you allow marketing technologies, Google Ads, Meta Pixel or
                similar tools may be used to measure campaigns, build audiences
                or show more relevant advertising. Marketing and advertising
                storage is denied by default.
              </p>
              <p>
                Rejecting marketing technologies does not prevent you from
                reading the page, registering or paying for the AI Business
                Sprint.
              </p>
            </section>

            <section className={styles.section}>
              <h2>5. Third-party services</h2>
              <p>
                Some services may set or read their own cookies when you choose
                to use them. These services operate under their own privacy and
                cookie terms. They may include:
              </p>
              <ul>
                <li>PayPal when you open or complete checkout.</li>
                <li>WhatsApp or Meta when you open a WhatsApp contact link.</li>
                <li>Zoom or Google Meet when you join an online class.</li>
                <li>
                  Google or Meta measurement tools after the relevant consent is
                  granted.
                </li>
                <li>
                  Vercel, AWS or other hosting and security providers where
                  necessary for delivery and protection of the site.
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>6. How to change your choice</h2>
              <p>
                Use the Cookie settings control in the footer or on this page to
                reopen the consent panel. You may also clear this website&apos;s
                stored data through your browser settings. Clearing browser data
                may cause the consent banner to appear again.
              </p>
              <div className={styles.notice}>
                Optional analytics and marketing tools should not load until the
                matching consent category has been granted.
              </div>
            </section>

            <section className={styles.section}>
              <h2>7. Updates and contact</h2>
              <p>
                We may update this Cookie Policy when our tools, providers or
                legal obligations change. The latest version will be published
                on this page with a revised date.
              </p>
              <p>
                Questions can be sent to{" "}
                <a href="mailto:imaginelabs@bodilum.com">
                  imaginelabs@bodilum.com
                </a>{" "}
                or raised by phone or WhatsApp at{" "}
                <a href="tel:+27733110149">+27 73 311 0149</a>.
              </p>
            </section>
          </article>
        </div>
      </main>
      <SiteLegalFooter />
    </>
  );
}
