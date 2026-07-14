import Image from "next/image";
import Link from "next/link";
import styles from "./programmes.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBrand}>
        <Image
          src="/images/logo-horizontal.svg"
          alt="Imaginelabs"
          width={896}
          height={177}
          style={{ width: "100%", height: "auto" }}
        />
        <p>A design-led learning studio by Bodilum.</p>
      </div>
      <div className={styles.footerLinks}>
        <span>Programmes</span>
        <Link href="/future-creators/design-coding">Design + Coding</Link>
        <Link href="/future-creators/design-lab">Design Lab</Link>
        <Link href="/future-creators/math-lab">Math Lab</Link>
        <Link href="/future-creators/ai-creators">AI Creators</Link>
      </div>
      <div className={styles.footerLinks}>
        <span>Contact</span>
        <a href="mailto:imaginelabs@bodilum.com">imaginelabs@bodilum.com</a>
        <a href="https://wa.me/27733110149" target="_blank" rel="noreferrer">
          WhatsApp 073 311 0149
        </a>
        <p>South Africa · Nigeria · Online</p>
      </div>
      <div className={styles.footerBottom}>
        <span>© {new Date().getFullYear()} Imaginelabs / Bodilum</span>
        <span>Think it. Design it. Build it.</span>
      </div>
    </footer>
  );
}
