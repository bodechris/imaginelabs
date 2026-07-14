"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type CaptureResponse = {
  ok?: boolean;
  reference?: string;
  amount?: string;
  orderId?: string;
  message?: string;
};

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<CaptureResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const captureStarted = useRef(false);

  useEffect(() => {
    if (captureStarted.current) return;
    captureStarted.current = true;

    const orderId = searchParams.get("token");
    const reference = searchParams.get("reference") || "";

    if (!orderId) {
      setError("PayPal did not return an order token.");
      setIsLoading(false);
      return;
    }

    let active = true;

    const captureOrder = async () => {
      try {
        const response = await fetch("/api/ai-business-sprint/paypal/capture", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId, reference }),
        });
        const payload = (await response
          .json()
          .catch(() => null)) as CaptureResponse | null;

        if (!response.ok || !payload?.ok) {
          throw new Error(
            payload?.message || "We could not confirm your PayPal payment.",
          );
        }

        if (active) setResult(payload);
      } catch (captureError) {
        if (active) {
          setError(
            captureError instanceof Error
              ? captureError.message
              : "We could not confirm your PayPal payment.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void captureOrder();

    return () => {
      active = false;
    };
  }, [searchParams]);

  return (
    <main className="paymentResultPage">
      <section>
        {isLoading ? (
          <>
            <p>Processing payment</p>
            <h1>Finalising your PayPal order.</h1>
            <p className="bodyCopy">
              We are confirming the payment with PayPal. Do not close this page.
            </p>
          </>
        ) : error ? (
          <>
            <p>Payment needs attention</p>
            <h1>We could not confirm your payment yet.</h1>
            <p className="bodyCopy">{error}</p>
            <div>
              <Link href="/#register">Return to payment</Link>
              <a
                href="https://wa.me/27733110149"
                target="_blank"
                rel="noreferrer"
              >
                Get help on WhatsApp
              </a>
            </div>
          </>
        ) : (
          <>
            <p>Payment received</p>
            <h1>Your seat is confirmed.</h1>
            <span>Reference</span>
            <strong>{result?.reference || "Imaginelabs booking"}</strong>
            {result?.amount ? (
              <p className="paymentAmount">
                <b>Charged:</b> {result.amount}
              </p>
            ) : null}
            <p className="bodyCopy">
              We received your PayPal payment. Your class link, preparation
              checklist and onboarding information will be sent before the
              session.
            </p>
            <div>
              <Link href="/">Return to the class page</Link>
              <a
                href="https://wa.me/27733110149"
                target="_blank"
                rel="noreferrer"
              >
                Contact Imaginelabs
              </a>
            </div>
          </>
        )}
      </section>

      <style>{`
        .paymentResultPage{min-height:100vh;display:grid;place-items:center;padding:32px;background:#fffdf2;color:#15101e;font-family:var(--il-body,Arial,sans-serif)}
        .paymentResultPage section{width:min(720px,100%);padding:clamp(32px,7vw,72px);border-radius:32px;background:#582998;color:white;box-shadow:0 30px 80px rgba(50,20,95,.18)}
        .paymentResultPage section>p:first-child{margin:0 0 28px;text-transform:uppercase;letter-spacing:.14em;font-size:12px;color:#51e6e3}
        .paymentResultPage h1{margin:0 0 32px;font-size:clamp(46px,8vw,88px);line-height:.94;letter-spacing:-.05em}
        .paymentResultPage span{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.13em;color:#ffe01b}
        .paymentResultPage strong{display:block;margin:8px 0 18px;font-size:clamp(22px,4vw,34px);word-break:break-word}
        .paymentResultPage .paymentAmount{margin:0 0 24px;color:#fff;font-size:16px}
        .paymentResultPage .bodyCopy{max-width:580px;margin:0;font-size:18px;line-height:1.6;color:rgba(255,255,255,.8);text-transform:none;letter-spacing:normal}
        .paymentResultPage div{display:flex;gap:12px;flex-wrap:wrap;margin-top:34px}
        .paymentResultPage a{display:inline-flex;padding:14px 20px;border-radius:999px;background:white;color:#32145f;text-decoration:none;font-weight:700}
        .paymentResultPage a+a{background:transparent;color:white;border:1px solid rgba(255,255,255,.35)}
      `}</style>
    </main>
  );
}
