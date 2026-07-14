import Image from "next/image";
import Link from "next/link";
import styles from "./LegalFooter.module.css";
import CookieSettingsButton from "@/components/privacy/CookieSettingsButton";

export default function SiteLegalFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.mainRow}>
        <div className={styles.identity}>
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
              className={styles.brandLogo}
            />
          </Link>

          <p className={styles.details}>
            Practical AI, design, coding and mathematics learning for businesses
            and future leaders.
          </p>
          <p className={styles.contact}>
            Randburg, Johannesburg, South Africa
            <br />
            <a href="mailto:imaginelabs@bodilum.com">
              imaginelabs@bodilum.com
            </a>{" "}
            · <a href="tel:+27733110149">+27 73 311 0149</a>
          </p>
        </div>

        <div className={styles.legalGroup}>
          <p className={styles.groupLabel}>Legal &amp; privacy</p>
          <nav
            className={styles.links}
            aria-label="Legal, privacy and contact links"
          >
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms, refunds &amp; cancellations</Link>
            <Link href="/cookies">Cookie Policy</Link>
            <CookieSettingsButton className={styles.cookieButton} />
            <a href="mailto:imaginelabs@bodilum.com">Contact</a>
          </nav>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <p>© {new Date().getFullYear()} imaginelabs. All rights reserved.</p>
        <p>
          From{" "}
          <a
            href="https://www.bodilum.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bodilum
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
