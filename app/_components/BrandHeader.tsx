"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./programmes.module.css";

const links = [
  { href: "/future-creators", label: "Overview" },
  { href: "/future-creators/design-coding", label: "Design + Coding" },
  { href: "/future-creators/design-lab", label: "Design Lab" },
  { href: "/future-creators/math-lab", label: "Math Lab" },
  { href: "/future-creators/ai-creators", label: "AI Creators" },
];

export default function BrandHeader({ onBook }: { onBook?: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}
    >
      <Link
        className={styles.brand}
        href="/future-creators"
        aria-label="Imaginelabs Future Creators"
      >
        <span className={styles.brandLogoShell}>
          <Image
            src="/images/logo-horizontal.svg"
            alt="Imaginelabs"
            width={896}
            height={177}
            priority
            style={{ width: "100%", height: "auto" }}
          />
        </span>
        <span className={styles.brandDivision}>Future Creators</span>
      </Link>

      <button
        className={styles.menuButton}
        type="button"
        aria-expanded={open}
        aria-label="Toggle navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <i />
        <i />
      </button>

      <nav className={`${styles.nav} ${open ? styles.navOpen : ""}`}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
      </nav>

      {onBook ? (
        <button className={styles.headerAction} type="button" onClick={onBook}>
          Book a place <Arrow />
        </button>
      ) : (
        <Link
          className={styles.headerAction}
          href="/future-creators/design-coding#pricing"
        >
          View prices <Arrow />
        </Link>
      )}
    </header>
  );
}

export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
