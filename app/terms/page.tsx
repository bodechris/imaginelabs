import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteLegalFooter from "@/components/legal/SiteLegalFooter";
import styles from "../legal-pages.module.css";

export const metadata: Metadata = {
  title: "Terms, Refunds and Cancellations",
  description:
    "Terms of booking, payment, refunds and participation for the imaginelabs AI Business Sprint.",
};

export default function TermsPage() {
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
        <p className={styles.eyebrow}>Legal / booking</p>
        <h1 className={styles.title}>Terms & Refunds</h1>
        <p className={styles.updated}>Last updated: 14 July 2026</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.aside}>
          <strong>Programme provider</strong>
          <span>Bodilum, operating imaginelabs</span>
          <span>Randburg, Johannesburg, South Africa</span>
          <a href="mailto:imaginelabs@bodilum.com">imaginelabs@bodilum.com</a>
          <a href="tel:+27733110149">+27 73 311 0149</a>
        </aside>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>1. Agreement</h2>
            <p>
              These terms apply when you register for or purchase access to the
              imaginelabs AI Business Sprint. By submitting the registration
              form and accepting these terms, you confirm that you are
              authorised to make the booking and that the information you
              provide is accurate.
            </p>
            <p>
              Nothing in these terms limits rights or remedies that cannot
              lawfully be excluded under applicable consumer law.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Course details and price</h2>
            <ul>
              <li>Programme: imaginelabs AI Business Sprint.</li>
              <li>
                Format: live online practical workshop using Zoom, Google Meet
                or another notified platform.
              </li>
              <li>
                Published price for the current intake: R950 per participant,
                unless a different promotion or invoice is expressly shown
                before payment.
              </li>
              <li>
                Published dates, times, deliverables and replay periods form
                part of the offer for that intake.
              </li>
            </ul>
            <p>
              We may update future class dates, prices or course content.
              Changes do not retrospectively increase the amount owed for a
              completed booking.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Registration and seat confirmation</h2>
            <p>
              Submitting the form records your registration but does not by
              itself confirm a paid seat. A seat is confirmed after cleared
              payment is successfully matched to your registration reference,
              unless we expressly confirm a different arrangement in writing.
            </p>
            <p>
              Seats are limited. If payment arrives after the intake has filled,
              we will offer a transfer to the next suitable date or a full
              refund.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Payments</h2>
            <ul>
              <li>
                PayPal payments are processed by PayPal under PayPal&apos;s own
                terms and privacy practices.
              </li>
              <li>
                Bank-transfer bookings must use the supplied reference so the
                payment can be matched.
              </li>
              <li>
                You are responsible for any bank, currency-conversion or
                payment-provider charge imposed on you by your provider.
              </li>
              <li>
                We may ask for reasonable proof of payment where a bank transfer
                or payment status cannot be matched automatically.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Participant cancellations and refunds</h2>
            <p>
              You may cancel an advance booking by emailing{" "}
              <a href="mailto:imaginelabs@bodilum.com">
                imaginelabs@bodilum.com
              </a>
              or sending a WhatsApp message to{" "}
              <a href="tel:+27733110149">+27 73 311 0149</a>. The following
              standard policy is intended to reflect the time remaining and the
              costs already committed:
            </p>
            <ul>
              <li>
                <strong>Seven or more calendar days before the class:</strong>{" "}
                full refund or one free transfer to another available intake.
              </li>
              <li>
                <strong>
                  Between 48 hours and seven days before the class:
                </strong>{" "}
                50% refund or one free transfer to another available intake.
              </li>
              <li>
                <strong>Less than 48 hours before the class:</strong> no
                standard cash refund, but we may offer one transfer where you
                notify us before the class begins and an alternative intake is
                available.
              </li>
              <li>
                <strong>No-show after the class starts:</strong> no refund or
                transfer, except where required by law or agreed because of
                exceptional circumstances.
              </li>
            </ul>
            <p>
              Any cancellation charge will remain reasonable in light of the
              notice given, the possibility of filling the seat, the nature of
              the booking and costs already incurred. Where applicable law
              requires a different result, that law takes priority.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Changes or cancellation by imaginelabs</h2>
            <p>
              We may move a class, change the delivery platform, replace a
              facilitator with a suitably qualified person or make reasonable
              content adjustments. If we cancel the intake and do not provide a
              reasonable alternative, you may choose a full refund or transfer
              to another intake.
            </p>
            <p>
              We are not responsible for indirect losses caused by a schedule
              change. Our obligation for a cancelled intake is limited to the
              remedies described above, except where applicable law provides
              otherwise.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Refund processing</h2>
            <ul>
              <li>
                Approved refunds are normally returned through the original
                payment method where practical.
              </li>
              <li>
                We aim to initiate an approved refund within 10 business days,
                although banks and payment providers may take additional time to
                display it.
              </li>
              <li>
                Non-refundable third-party processing costs may be deducted only
                where this is lawful, reasonable and clearly communicated.
              </li>
              <li>
                Promotional codes, transferred seats and bundled offers may be
                refunded only to the amount actually paid for the affected
                booking.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Attendance and conduct</h2>
            <ul>
              <li>
                You are responsible for a suitable device, internet connection,
                software access and a quiet environment.
              </li>
              <li>
                Joining links are personal and may not be shared, resold or
                published.
              </li>
              <li>
                Participants must treat facilitators and other attendees
                respectfully and must not record, disrupt or misuse private
                information shared in the class.
              </li>
              <li>
                We may remove a participant for serious disruption, harassment,
                unlawful activity or misuse of materials. A refund is not
                guaranteed in those circumstances.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>9. Educational scope and results</h2>
            <p>
              The sprint provides practical education, templates and guided
              creation. It does not provide legal, tax, accounting, medical or
              regulated professional advice. AI outputs can be inaccurate and
              must be reviewed before use. You remain responsible for business
              decisions, customer communications and compliance in your own
              business.
            </p>
            <p>
              Examples, templates and testimonials do not guarantee a particular
              revenue, sales, productivity or marketing result.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Materials and intellectual property</h2>
            <p>
              Bodilum and imaginelabs retain ownership of the workshop
              structure, slides, recordings, branded templates and original
              teaching materials. After full payment, you receive a limited,
              non-exclusive, non-transferable licence to use the participant
              materials internally for your own business.
            </p>
            <p>
              You may not resell, republish, upload, distribute, teach from or
              commercially sublicense the materials without written permission.
              You retain ownership of your own business information and original
              content that you create.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Recordings and privacy</h2>
            <p>
              If a session will be recorded, we will notify participants. The
              recording may capture names, voices, chat or screens shared during
              the session. You may keep your camera off and avoid sharing
              confidential information. Any replay is for registered
              participants and may not be redistributed.
            </p>
            <p>
              Our <Link href="/privacy">Privacy Policy</Link> explains how
              registration and attendance information is handled.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Liability and general terms</h2>
            <p>
              To the fullest extent permitted by law, we are not liable for
              indirect, consequential or business losses arising from use of the
              course, third-party platforms, participant equipment or reliance
              on AI-generated output. Our aggregate liability relating to a
              booking will not exceed the amount paid for that booking, except
              where liability cannot lawfully be limited.
            </p>
            <p>
              If part of these terms is unenforceable, the remaining terms
              continue to apply. South African law governs these terms, subject
              to any mandatory consumer protection that applies in your country.
              Before formal proceedings, the parties should first try in good
              faith to resolve a dispute through the contact details above.
            </p>
          </section>
        </article>
      </div>

      <SiteLegalFooter />
    </main>
  );
}
