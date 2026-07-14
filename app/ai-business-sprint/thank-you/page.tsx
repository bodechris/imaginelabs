import type { Metadata } from "next";
import Link from "next/link";
import styles from "../status.module.css";

export const metadata: Metadata = {
  title: "Payment received — AI Business Sprint",
  description:
    "Next steps after paying for the imaginelabs AI Business Sprint.",
  robots: { index: false, follow: false },
};

const whatsappMessage = encodeURIComponent(
  "Hi imaginelabs, I have completed payment for the AI Business Sprint. Please help me confirm that my payment has been matched to my registration.",
);

export default function AiBusinessSprintThankYouPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.mark} aria-hidden="true">
          ✓
        </div>
        <p className={styles.eyebrow}>AI Business Sprint / payment return</p>
        <h1 className={styles.title}>Thank you. Your payment was submitted.</h1>
        <p className={styles.lead}>
          PayPal should send its own receipt. We will match the payment to your
          registration and send your confirmed class details, joining link and
          preparation notes by email.
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <strong>01 / Check email</strong>
            <span>
              Look for your PayPal receipt and the imaginelabs registration
              confirmation.
            </span>
          </div>
          <div className={styles.step}>
            <strong>02 / Save the date</strong>
            <span>
              Saturday, 1 August, 10:00 AM–1:00 PM SAST. Any change will be
              communicated directly.
            </span>
          </div>
          <div className={styles.step}>
            <strong>03 / Bring your business</strong>
            <span>
              Prepare your offers, customer questions, brand references and one
              process you want to improve.
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <a
            className={styles.primary}
            href={`https://wa.me/27733110149?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            Confirm on WhatsApp
          </a>
          <Link className={styles.secondary} href="/">
            Return to course page
          </Link>
        </div>

        <p className={styles.legal}>
          A return to this page is not, by itself, independent proof that a
          payment settled. Your seat is confirmed after the transaction is
          matched. See our{" "}
          <Link href="/terms">refund and cancellation terms</Link> and{" "}
          <Link href="/privacy">privacy policy</Link>.
        </p>
      </section>
    </main>
  );
}
