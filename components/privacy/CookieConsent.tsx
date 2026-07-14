"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ConsentPreferences = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: 1;
};

declare global {
  interface Window {
    __IL_CONSENT__?: ConsentPreferences;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "imaginelabs_consent_v1";
const COOKIE_NAME = "imaginelabs_consent";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function readStoredConsent(): ConsentPreferences | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return null;

    const parsed = JSON.parse(value) as Partial<ConsentPreferences>;
    if (parsed.version !== 1) return null;

    return {
      essential: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
      version: 1,
    };
  } catch {
    return null;
  }
}

function persistConsent(preferences: ConsentPreferences) {
  const serialized = JSON.stringify(preferences);
  window.localStorage.setItem(STORAGE_KEY, serialized);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(serialized)}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax; Secure`;
  window.__IL_CONSENT__ = preferences;

  window.gtag?.("consent", "update", {
    analytics_storage: preferences.analytics ? "granted" : "denied",
    ad_storage: preferences.marketing ? "granted" : "denied",
    ad_user_data: preferences.marketing ? "granted" : "denied",
    ad_personalization: preferences.marketing ? "granted" : "denied",
  });

  window.dispatchEvent(
    new CustomEvent("imaginelabs:consent-updated", { detail: preferences }),
  );
}

function buildPreferences(
  analytics: boolean,
  marketing: boolean,
): ConsentPreferences {
  return {
    essential: true,
    analytics,
    marketing,
    updatedAt: new Date().toISOString(),
    version: 1,
  };
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customising, setCustomising] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();

    if (stored) {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
      window.__IL_CONSENT__ = stored;
      window.dispatchEvent(
        new CustomEvent("imaginelabs:consent-updated", { detail: stored }),
      );
      return;
    }

    setVisible(true);
  }, []);

  function save(preferences: ConsentPreferences) {
    persistConsent(preferences);
    setVisible(false);
    setCustomising(false);
  }

  if (!visible) return null;

  return (
    <aside
      className="ilConsent"
      role="dialog"
      aria-modal="true"
      aria-labelledby="il-consent-title"
    >
      <div className="ilConsent__copy">
        <p className="ilConsent__eyebrow">Your privacy choices</p>
        <h2 id="il-consent-title">Choose how this website uses cookies.</h2>
        <p>
          Essential storage keeps the site and registration flow working.
          Analytics and advertising technologies stay off unless you choose to
          allow them. Read the <Link href="/privacy">Privacy Policy</Link> and{" "}
          <Link href="/terms">Terms</Link>.
        </p>
      </div>

      {customising && (
        <div className="ilConsent__settings">
          <div>
            <span>
              <strong>Essential</strong>
              <small>
                Required for security, consent preferences and core website
                functions.
              </small>
            </span>
            <input
              type="checkbox"
              checked
              disabled
              aria-label="Essential cookies are always active"
            />
          </div>
          <label>
            <span>
              <strong>Analytics</strong>
              <small>
                Helps us understand visits and improve the landing page.
              </small>
            </span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
            />
          </label>
          <label>
            <span>
              <strong>Advertising</strong>
              <small>
                Allows conversion measurement and relevant advertising on
                platforms such as Meta and Google.
              </small>
            </span>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(event) => setMarketing(event.target.checked)}
            />
          </label>
        </div>
      )}

      <div className="ilConsent__actions">
        {customising ? (
          <>
            <button
              type="button"
              className="ilConsent__secondary"
              onClick={() => save(buildPreferences(false, false))}
            >
              Reject optional
            </button>
            <button
              type="button"
              className="ilConsent__primary"
              onClick={() => save(buildPreferences(analytics, marketing))}
            >
              Save choices
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="ilConsent__text"
              onClick={() => setCustomising(true)}
            >
              Customise
            </button>
            <button
              type="button"
              className="ilConsent__secondary"
              onClick={() => save(buildPreferences(false, false))}
            >
              Reject optional
            </button>
            <button
              type="button"
              className="ilConsent__primary"
              onClick={() => save(buildPreferences(true, true))}
            >
              Accept all
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .ilConsent {
          position: fixed;
          z-index: 10000;
          left: clamp(12px, 2vw, 28px);
          right: clamp(12px, 2vw, 28px);
          bottom: clamp(12px, 2vw, 28px);
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(280px, auto);
          gap: 24px;
          align-items: end;
          max-width: 1180px;
          margin: 0 auto;
          padding: clamp(20px, 3vw, 32px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 28px;
          color: #ffffff;
          background: rgba(21, 16, 30, 0.97);
          box-shadow: 0 30px 100px rgba(15, 7, 30, 0.38);
          font-family: var(--font-roboto), Arial, sans-serif;
        }

        .ilConsent__eyebrow {
          margin: 0 0 10px;
          color: #1feac1;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .ilConsent h2 {
          margin: 0;
          font-family: var(--font-bricolage-grotesque), Arial, sans-serif;
          font-size: clamp(25px, 3vw, 40px);
          line-height: 0.98;
          letter-spacing: -0.045em;
        }

        .ilConsent__copy > p:last-child {
          max-width: 760px;
          margin: 14px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 14px;
          line-height: 1.55;
        }

        .ilConsent a {
          color: #ffe01b;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .ilConsent__settings {
          grid-column: 1 / -1;
          display: grid;
          gap: 10px;
          padding-top: 4px;
        }

        .ilConsent__settings > div,
        .ilConsent__settings > label {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: center;
          padding: 14px 16px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
        }

        .ilConsent__settings span,
        .ilConsent__settings strong,
        .ilConsent__settings small {
          display: block;
        }

        .ilConsent__settings strong {
          font-size: 14px;
        }

        .ilConsent__settings small {
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.64);
          line-height: 1.35;
        }

        .ilConsent__settings input {
          width: 19px;
          height: 19px;
          accent-color: #1feac1;
        }

        .ilConsent__actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ilConsent button {
          min-height: 46px;
          padding: 12px 17px;
          border-radius: 999px;
          font: inherit;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .ilConsent__primary {
          border: 0;
          color: #32145f;
          background: #ffe01b;
        }

        .ilConsent__secondary {
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .ilConsent__text {
          border: 0;
          color: rgba(255, 255, 255, 0.74);
          background: transparent;
        }

        @media (max-width: 760px) {
          .ilConsent {
            grid-template-columns: 1fr;
            max-height: calc(100svh - 24px);
            overflow-y: auto;
          }

          .ilConsent__actions {
            justify-content: stretch;
          }

          .ilConsent button {
            flex: 1 1 auto;
          }
        }
      `}</style>
    </aside>
  );
}
