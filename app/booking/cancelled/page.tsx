import Image from "next/image";
import Link from "next/link";
import styles from "../../_components/programmes.module.css";

export default async function BookingCancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className={styles.statusPage}>
      <Image src="/images/logo-text.svg" alt="Imaginelabs" width={1020} height={176} />
      <span>Payment not completed</span>
      <h1>Your booking has not been charged.</h1>
      <p>You can return to the programme and try again, or contact us on WhatsApp if you need help choosing a plan.</p>
      <strong>Reference: {params.reference || "Not created"}</strong>
      <Link href="/future-creators">Return to the programmes →</Link>
    </main>
  );
}
