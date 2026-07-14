"use client";

import { useEffect, useRef, useState } from "react";

type PayPalApprovalData = {
  orderID: string;
};

type PayPalButtonInstance = {
  isEligible: () => boolean;
  render: (target: HTMLElement | string) => Promise<void>;
  close?: () => Promise<void>;
};

type PayPalNamespace = {
  FUNDING: {
    PAYPAL: string;
  };
  Buttons: (options: {
    fundingSource?: string;
    style?: {
      layout?: "vertical" | "horizontal";
      color?: "gold" | "blue" | "silver" | "white" | "black";
      shape?: "rect" | "pill";
      label?: "paypal" | "checkout" | "buynow" | "pay";
      height?: number;
      tagline?: boolean;
    };
    createOrder: () => Promise<string> | string;
    onApprove: (data: PayPalApprovalData) => Promise<void> | void;
    onCancel?: () => void;
    onError?: (error: unknown) => void;
  }) => PayPalButtonInstance;
};

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

type Props = {
  clientId: string;
  orderId: string;
  amountUsd: number;
  reference: string;
  customer: {
    email: string;
    name: string;
  };
};

const sdkScriptId = "paypal-standard-checkout-sdk";

function loadPayPalSdk(clientId: string) {
  if (window.paypal?.Buttons) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(
      sdkScriptId,
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener(
        "load",
        () => {
          if (window.paypal?.Buttons) resolve();
          else reject(new Error("PayPal Checkout did not load correctly."));
        },
        { once: true },
      );
      existing.addEventListener(
        "error",
        () => reject(new Error("PayPal Checkout could not be loaded.")),
        { once: true },
      );
      return;
    }

    const staleSdk = document.querySelector<HTMLScriptElement>(
      'script[src*="paypal.com/sdk/js"]',
    );

    if (staleSdk && !window.paypal?.Buttons) {
      staleSdk.remove();
      delete window.paypal;
    }

    const script = document.createElement("script");
    script.id = sdkScriptId;
    script.src =
      "https://www.paypal.com/sdk/js" +
      `?client-id=${encodeURIComponent(clientId)}` +
      "&currency=USD&intent=capture&commit=true&components=buttons";
    script.async = true;
    script.dataset.sdkIntegrationSource = "button-factory";
    script.onload = () => {
      if (window.paypal?.Buttons) resolve();
      else reject(new Error("PayPal Checkout did not load correctly."));
    };
    script.onerror = () =>
      reject(new Error("PayPal Checkout could not be loaded."));
    document.head.appendChild(script);
  });
}

export default function PayPalStandardCheckoutButton({
  clientId,
  orderId,
  amountUsd,
  reference,
  customer,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<PayPalButtonInstance | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "processing" | "cancelled" | "error"
  >("loading");
  const [message, setMessage] = useState(
    "Loading PayPal's secure checkout button...",
  );

  useEffect(() => {
    let active = true;

    async function initialise() {
      try {
        setStatus("loading");
        setMessage("Loading PayPal's secure checkout button...");
        await loadPayPalSdk(clientId);

        if (!active || !containerRef.current || !window.paypal?.Buttons) {
          return;
        }

        containerRef.current.innerHTML = "";

        const buttons = window.paypal.Buttons({
          fundingSource: window.paypal.FUNDING.PAYPAL,
          style: {
            layout: "vertical",
            color: "gold",
            shape: "pill",
            label: "paypal",
            height: 50,
            tagline: false,
          },
          createOrder: () => orderId,
          onApprove: async ({ orderID }) => {
            if (!active) return;

            try {
              setStatus("processing");
              setMessage(
                "Payment approved. Confirming your registration with PayPal...",
              );

              const response = await fetch(
                "/api/ai-business-sprint/paypal/capture",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderId: orderID,
                    reference,
                    email: customer.email,
                    name: customer.name,
                  }),
                },
              );
              const payload = (await response.json().catch(() => null)) as
                | {
                    ok?: boolean;
                    reference?: string;
                    message?: string;
                  }
                | null;

              if (!response.ok || !payload?.ok) {
                throw new Error(
                  payload?.message ||
                    "PayPal approved the order, but we could not confirm the payment.",
                );
              }

              const confirmedReference = payload.reference || reference;
              window.location.assign(
                `/ai-business-sprint/confirmed?reference=${encodeURIComponent(confirmedReference)}`,
              );
            } catch (error) {
              console.error("PayPal capture confirmation failed", error);
              if (!active) return;
              setStatus("error");
              setMessage(
                error instanceof Error
                  ? error.message
                  : "We could not confirm the PayPal payment.",
              );
            }
          },
          onCancel: () => {
            if (!active) return;
            setStatus("cancelled");
            setMessage(
              "PayPal checkout was closed before payment. Your reference remains valid, so you can try again below.",
            );
          },
          onError: (error) => {
            console.error("PayPal Standard Checkout error", error);
            if (!active) return;
            setStatus("error");
            setMessage(
              "PayPal could not open or complete checkout. Please try again, use FNB deposit, or contact us on WhatsApp.",
            );
          },
        });

        if (!buttons.isEligible()) {
          throw new Error(
            "PayPal Standard Checkout is not available in this browser right now.",
          );
        }

        buttonRef.current = buttons;
        await buttons.render(containerRef.current);

        if (!active) return;
        setStatus("ready");
        setMessage(
          "PayPal handles the payment securely. Eligible customers can also choose debit or credit card during PayPal checkout.",
        );
      } catch (error) {
        console.error("PayPal Standard Checkout initialisation failed", error);
        if (!active) return;
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "PayPal Checkout could not be loaded.",
        );
      }
    }

    void initialise();

    return () => {
      active = false;
      const closePromise = buttonRef.current?.close?.();
      void closePromise?.catch(() => undefined);
      buttonRef.current = null;
    };
  }, [clientId, customer.email, customer.name, orderId, reference]);

  return (
    <section className="paypalStandardShell" aria-label="PayPal checkout">
      <header>
        <div>
          <span>Secure PayPal checkout</span>
          <strong>USD {amountUsd.toFixed(2)}</strong>
        </div>
        <small>Reference: {reference}</small>
      </header>

      <div
        ref={containerRef}
        className="paypalButtonMount"
        aria-busy={status === "loading" || status === "processing"}
      />

      <p
        className={`paypalCheckoutStatus ${status}`}
        role={status === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {message}
      </p>

      <p className="paypalSecurityNote">
        You stay on Imaginelabs while PayPal opens its secure checkout. Bodilum
        never receives or stores your card number. Guest card checkout is shown
        by PayPal when it is available for the buyer and transaction.
      </p>

      <style>{`
        .paypalStandardShell {
          display: grid;
          gap: 18px;
          margin-top: 24px;
          padding: clamp(20px, 3vw, 30px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 24px;
          background: #2f1558;
          color: #fff;
        }

        .paypalStandardShell header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .paypalStandardShell header div {
          display: grid;
          gap: 5px;
        }

        .paypalStandardShell header span {
          color: #51e6e3;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .paypalStandardShell header strong {
          font-size: clamp(22px, 4vw, 32px);
          line-height: 1;
        }

        .paypalStandardShell header small {
          color: rgba(255, 255, 255, 0.72);
          font-size: 12px;
          text-align: right;
          word-break: break-word;
        }

        .paypalButtonMount {
          position: relative;
          z-index: 1;
          min-height: 50px;
          overflow: visible;
        }

        .paypalCheckoutStatus {
          margin: 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 13px;
          font-weight: 650;
          line-height: 1.55;
        }

        .paypalCheckoutStatus.processing {
          color: #ffe01b;
        }

        .paypalCheckoutStatus.cancelled,
        .paypalCheckoutStatus.error {
          color: #ffd1d1;
        }

        .paypalSecurityNote {
          margin: 0;
          color: rgba(255, 255, 255, 0.58);
          font-size: 11px;
          line-height: 1.55;
        }

        @media (max-width: 640px) {
          .paypalStandardShell header {
            display: grid;
          }

          .paypalStandardShell header small {
            text-align: left;
          }
        }
      `}</style>
    </section>
  );
}
