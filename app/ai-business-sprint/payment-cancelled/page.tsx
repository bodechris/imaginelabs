import type { Metadata } from "next";
import Link from "next/link";
import styles from "../status.module.css";

export const metadata: Metadata = {
  title: "Payment not completed — AI Business Sprint",
  description:
    "Return to the AI Business Sprint registration after cancelling payment.",
  robots: { index: false, follow: false },
};

const whatsappMessage = encodeURIComponent(
  "Hi imaginelabs, I tried to pay for the AI Business Sprint but did not complete the PayPal checkout. Please help me with the payment options.",
);

export default function PaymentCancelledPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.mark} aria-hidden="true">
          ↩
        </div>
        <p className={styles.eyebrow}>AI Business Sprint / checkout</p>
        <h1 className={styles.title}>No payment was completed.</h1>
        <p className={styles.lead}>
          Your PayPal checkout was cancelled or closed. You have not been
          charged by this page. Return to registration to try again or contact
          us for help with PayPal or bank transfer.
        </p>

        <div className={styles.actions}>
          <Link className={styles.primary} href="/#register">
            Return to payment
          </Link>
          <a
            className={styles.secondary}
            href={`https://wa.me/27733110149?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            Get help on WhatsApp
          </a>
        </div>

        <p className={styles.legal}>
          Need to review the booking conditions first? Read the{" "}
          <Link href="/terms">terms, refunds and cancellation policy</Link>.
        </p>
      </section>
    </main>
  );
}
