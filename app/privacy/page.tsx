import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteLegalFooter from "@/components/legal/SiteLegalFooter";
import styles from "../legal-pages.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How imaginelabs and Bodilum collect, use, share and protect personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.brand} aria-label="imaginelabs home">
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
        <p className={styles.eyebrow}>Legal / privacy</p>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: 14 July 2026</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.aside}>
          <strong>Responsible party</strong>
          <span>Bodilum, operating the imaginelabs learning programme</span>
          <span>Randburg, Johannesburg, South Africa</span>
          <a href="mailto:imaginelabs@bodilum.com">imaginelabs@bodilum.com</a>
          <a href="tel:+27733110149">+27 73 311 0149</a>
        </aside>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>1. What this policy covers</h2>
            <p>
              This policy explains how Bodilum, operating imaginelabs, processes
              personal information when you visit imaginelabs.bodilum.com,
              register for the AI Business Sprint, contact us, pay for a class,
              attend an online session or ask to receive updates.
            </p>
            <p>
              We process personal information in line with applicable
              data-protection requirements, including South Africa&apos;s
              Protection of Personal Information Act, 2013 (POPIA), and, where
              applicable, Nigeria&apos;s Data Protection Act, 2023.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information we collect</h2>
            <ul>
              <li>
                <strong>Registration details:</strong> first name, last name,
                company name, country, email address, phone or WhatsApp number
                and your stated business goal.
              </li>
              <li>
                <strong>Booking and transaction information:</strong> class
                selected, amount, payment method, payment reference, payment
                status and limited transaction identifiers.
              </li>
              <li>
                <strong>Communications:</strong> emails, WhatsApp messages,
                support requests, feedback, survey responses and
                attendance-related correspondence.
              </li>
              <li>
                <strong>Technical information:</strong> browser, device,
                approximate location derived from IP address, website
                interactions and consent preferences when those technologies are
                enabled.
              </li>
              <li>
                <strong>Marketing preferences:</strong> whether you asked to
                receive future class dates, offers or other imaginelabs updates.
              </li>
            </ul>
            <div className={styles.notice}>
              We do not ask you to enter card numbers or PayPal credentials into
              our website. PayPal processes payment credentials within its own
              secure checkout. We receive only the information needed to
              identify and reconcile the payment.
            </div>
          </section>

          <section className={styles.section}>
            <h2>3. Why we use your information</h2>
            <ul>
              <li>
                To respond to enquiries and take steps requested before you
                enter into a booking.
              </li>
              <li>
                To register you, process and reconcile payment, reserve your
                seat and provide the class and included materials.
              </li>
              <li>
                To send operational emails, reminders, joining links, receipts,
                changes, replay information and support messages.
              </li>
              <li>
                To prevent fraud, protect the website, keep records and meet
                tax, accounting or other legal obligations.
              </li>
              <li>
                To improve the class, website and customer experience using
                aggregated or consented analytics.
              </li>
              <li>
                To send marketing only where you have consented or where another
                lawful basis clearly permits it, with an easy way to opt out.
              </li>
            </ul>
            <p>
              Depending on the activity, our lawful basis may be performance of
              a contract, steps requested before a contract, compliance with a
              legal obligation, our legitimate business interests or your
              consent. You may withdraw consent at any time, but withdrawal does
              not affect processing that was lawful before withdrawal.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Services that may receive information</h2>
            <p>
              We share only what is reasonably necessary with service providers
              that support the programme, including:
            </p>
            <ul>
              <li>
                <strong>PayPal:</strong> payment checkout, transaction
                processing, fraud prevention and receipts.
              </li>
              <li>
                <strong>Resend and our email systems:</strong> registration
                confirmations, administrative notices and support emails.
              </li>
              <li>
                <strong>Listmonk on Bodilum/BiznesXpo infrastructure:</strong>{" "}
                transactional class communications and, only when you opt in,
                marketing list management.
              </li>
              <li>
                <strong>WhatsApp/Meta:</strong> when you choose to contact us or
                receive operational communication through WhatsApp.
              </li>
              <li>
                <strong>Zoom or Google Meet:</strong> online class delivery,
                invitations and attendance-related functions.
              </li>
              <li>
                <strong>
                  Website hosting and infrastructure providers, including Vercel
                  and AWS where used:
                </strong>{" "}
                hosting, security, logs and service delivery.
              </li>
              <li>
                <strong>
                  Google Analytics, Google Ads and Meta advertising tools:
                </strong>{" "}
                only after the relevant cookie or tracking consent is granted,
                except where strictly necessary functionality applies.
              </li>
              <li>
                <strong>
                  Professional advisers, regulators or authorities:
                </strong>{" "}
                where necessary to comply with law, protect rights or respond to
                a valid legal request.
              </li>
            </ul>
            <p>We do not sell personal information.</p>
          </section>

          <section className={styles.section}>
            <h2>5. Cookies and tracking choices</h2>
            <p>
              Essential storage is used for core functions such as remembering
              your privacy choices and keeping the website secure. Analytics and
              advertising technologies are disabled by default and should be
              activated only after you choose to allow them through the consent
              banner.
            </p>
            <p>
              You can reject optional technologies without losing access to the
              landing page or registration. You can clear your choice in your
              browser storage or contact us to ask for assistance changing it.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. International processing</h2>
            <p>
              Some providers may process information outside South Africa or
              Nigeria. Where cross-border processing occurs, we take reasonable
              steps to use providers and arrangements that offer an appropriate
              level of protection, contractual safeguards or another lawful
              transfer mechanism.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Retention</h2>
            <ul>
              <li>
                Registration and attendance records are generally kept for up to
                24 months after the relevant class, unless a longer period is
                required for an active dispute or legal obligation.
              </li>
              <li>
                Transaction, invoice and accounting records are kept for the
                period required by applicable law and legitimate audit needs.
              </li>
              <li>
                Marketing records are kept until you unsubscribe, withdraw
                consent or the information is no longer needed.
              </li>
              <li>
                Consent preferences may be retained for up to 12 months before
                we ask again, unless you change or clear them earlier.
              </li>
            </ul>
            <p>
              We may retain de-identified or aggregated information that no
              longer identifies you.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Your rights</h2>
            <p>Subject to applicable law, you may ask us to:</p>
            <ul>
              <li>
                confirm whether we hold your personal information and provide
                access to it;
              </li>
              <li>correct, update or complete inaccurate information;</li>
              <li>
                delete information that we are not legally required or otherwise
                entitled to keep;
              </li>
              <li>object to or restrict certain processing;</li>
              <li>withdraw consent and stop direct marketing;</li>
              <li>
                provide information in a portable form where the law provides
                that right; or
              </li>
              <li>
                explain a significant automated decision, although we do not
                currently use automated decision-making to decide class
                admission.
              </li>
            </ul>
            <p>
              Send requests to{" "}
              <a href="mailto:imaginelabs@bodilum.com">
                imaginelabs@bodilum.com
              </a>
              . We may need to verify your identity before acting on a request.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Security and children</h2>
            <p>
              We use reasonable technical and organisational safeguards designed
              to prevent loss, misuse, unauthorised access or disclosure. No
              internet service can guarantee absolute security, so please avoid
              sending sensitive payment credentials or confidential business
              information through ordinary forms or WhatsApp.
            </p>
            <p>
              The AI Business Sprint is intended for adult business owners and
              representatives. It is not designed to collect information
              directly from children. Separate privacy information and guardian
              consent should be used for any imaginelabs programme aimed at
              minors.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Complaints and changes</h2>
            <p>
              Please contact us first so we can try to resolve a privacy
              concern. You may also complain to the South African Information
              Regulator or, where Nigerian data-protection law applies, the
              Nigeria Data Protection Commission.
            </p>
            <p>
              We may update this policy when our services, providers or legal
              obligations change. The latest version and date will be published
              on this page.
            </p>
          </section>
        </article>
      </div>

      <SiteLegalFooter />
    </main>
  );
}
