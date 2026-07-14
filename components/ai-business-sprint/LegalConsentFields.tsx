"use client";

import Link from "next/link";

type LegalConsentFieldsProps = {
  privacyAccepted: boolean;
  termsAccepted: boolean;
  marketingConsent: boolean;
  onPrivacyAcceptedChange: (checked: boolean) => void;
  onTermsAcceptedChange: (checked: boolean) => void;
  onMarketingConsentChange: (checked: boolean) => void;
};

export default function LegalConsentFields({
  privacyAccepted,
  termsAccepted,
  marketingConsent,
  onPrivacyAcceptedChange,
  onTermsAcceptedChange,
  onMarketingConsentChange,
}: LegalConsentFieldsProps) {
  return (
    <div className="legalConsentFields">
      <label>
        <input
          required
          type="checkbox"
          checked={privacyAccepted}
          onChange={(event) => onPrivacyAcceptedChange(event.target.checked)}
        />
        <span>
          I have read the{" "}
          <Link href="/privacy" target="_blank">
            Privacy Policy
          </Link>{" "}
          and understand how my registration information will be used.
        </span>
      </label>

      <label>
        <input
          required
          type="checkbox"
          checked={termsAccepted}
          onChange={(event) => onTermsAcceptedChange(event.target.checked)}
        />
        <span>
          I accept the{" "}
          <Link href="/terms" target="_blank">
            Terms, refund and cancellation policy
          </Link>{" "}
          for the AI Business Sprint.
        </span>
      </label>

      <label>
        <input
          type="checkbox"
          checked={marketingConsent}
          onChange={(event) => onMarketingConsentChange(event.target.checked)}
        />
        <span>
          Optional: send me useful imaginelabs updates, future class dates and
          related offers. I can unsubscribe at any time.
        </span>
      </label>

      <p className="cookieNote">
        Optional analytics and advertising tools are controlled separately. See
        the <Link href="/cookies" target="_blank">Cookie Policy</Link> or use
        Cookie settings in the footer.
      </p>

      <style jsx>{`
        .legalConsentFields {
          display: grid;
          gap: 11px;
          margin-top: 18px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 18px;
          background: rgba(0, 0, 0, 0.14);
        }

        label {
          display: grid;
          grid-template-columns: 20px minmax(0, 1fr);
          gap: 11px;
          align-items: start;
          color: rgba(255, 255, 255, 0.76);
          font-size: 13px;
          font-weight: 700;
          line-height: 1.45;
          letter-spacing: 0;
          text-transform: none;
          cursor: pointer;
        }

        input {
          width: 18px;
          height: 18px;
          margin-top: 1px;
          accent-color: #1feac1;
        }

        a {
          color: #ffe01b;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .cookieNote {
          margin: 3px 0 0 31px;
          color: rgba(255, 255, 255, 0.58);
          font-size: 12px;
          font-weight: 700;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
