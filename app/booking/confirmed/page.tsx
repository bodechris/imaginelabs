import Image from "next/image";
import Link from "next/link";
import styles from "../../_components/programmes.module.css";

export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className={styles.statusPage}>
      <Image src="/images/logo-text.svg" alt="Imaginelabs" width={1020} height={176} />
      <span>Payment received</span>
      <h1>Your child’s place is taking shape.</h1>
      <p>Thank you. We will contact you with onboarding, schedule options and the short learner assessment.</p>
      <strong>Reference: {params.reference || "Imaginelabs booking"}</strong>
      <Link href="/future-creators">Return to Future Creators →</Link>
    </main>
  );
}
