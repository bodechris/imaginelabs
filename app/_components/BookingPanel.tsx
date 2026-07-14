"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ProgrammeConfig, PlanId } from "../_lib/programmes";
import type { PricingContext } from "../_lib/pricing";
import { Arrow } from "./BrandHeader";
import styles from "./programmes.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  programme: ProgrammeConfig;
  pricing: PricingContext;
  initialPlan?: PlanId;
};

type Status = { type: "idle" | "loading" | "error" | "success"; message?: string };

function countryName(code: string) {
  if (code === "ZA") return "South Africa";
  if (code === "NG") return "Nigeria";
  return code || "";
}

export default function BookingPanel({
  open,
  onClose,
  programme,
  pricing,
  initialPlan = "four",
}: Props) {
  const [planId, setPlanId] = useState<PlanId>(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "bank">("paypal");
  const [status, setStatus] = useState<Status>({ type: "idle" });

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setPlanId(initialPlan), [initialPlan]);

  const selectedPrice = useMemo(
    () => pricing.options.find((option) => option.planId === planId) || pricing.options[0],
    [planId, pricing.options],
  );

  if (!open) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "loading" });
    const form = new FormData(event.currentTarget);
    const payload = {
      programmeId: programme.id,
      planId,
      offerToken: pricing.offerToken,
      parentName: String(form.get("parentName") || ""),
      parentEmail: String(form.get("parentEmail") || ""),
      phone: String(form.get("phone") || ""),
      childName: String(form.get("childName") || ""),
      childAge: String(form.get("childAge") || ""),
      grade: String(form.get("grade") || ""),
      country: String(form.get("country") || ""),
      city: String(form.get("city") || ""),
    };

    try {
      const endpoint =
        paymentMethod === "paypal" ? "/api/paypal/create-order" : "/api/bank-transfer";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        approveUrl?: string;
        message?: string;
        reference?: string;
      };
      if (!response.ok) throw new Error(data.message || "Unable to complete your booking.");

      if (paymentMethod === "paypal" && data.approveUrl) {
        window.location.assign(data.approveUrl);
        return;
      }

      setStatus({
        type: "success",
        message: `Bank details and your reference ${data.reference || ""} have been sent to your email.`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  }

  return (
    <div className={styles.bookingBackdrop} role="presentation" onMouseDown={onClose}>
      <aside
        className={styles.bookingPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className={styles.bookingClose} type="button" onClick={onClose} aria-label="Close booking form">
          Close <span>×</span>
        </button>

        {status.type === "success" ? (
          <div className={styles.bookingSuccess}>
            <span>Booking initiated</span>
            <h2 id="booking-title">Check your inbox.</h2>
            <p>{status.message}</p>
            <button type="button" className={styles.primaryButton} onClick={onClose}>
              Return to the programme
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className={styles.bookingForm}>
            <div className={styles.bookingHeading}>
              <span>Secure a monthly place</span>
              <h2 id="booking-title">Book {programme.title}</h2>
              <p>
                Complete the parent details below. Places are confirmed after full payment.
              </p>
            </div>

            <div className={styles.planPicker}>
              {pricing.options.map((option) => (
                <label key={option.planId} className={planId === option.planId ? styles.planActive : ""}>
                  <input
                    type="radio"
                    name="plan"
                    value={option.planId}
                    checked={planId === option.planId}
                    onChange={() => setPlanId(option.planId)}
                  />
                  <span>{option.sessions} sessions / month</span>
                  <strong>{option.localFormatted}</strong>
                </label>
              ))}
            </div>

            <div className={styles.fieldGrid}>
              <label>
                Parent / guardian name
                <input name="parentName" required autoComplete="name" />
              </label>
              <label>
                Parent email
                <input name="parentEmail" type="email" required autoComplete="email" />
              </label>
              <label>
                Phone / WhatsApp
                <input name="phone" required autoComplete="tel" />
              </label>
              <label>
                Child's first name
                <input name="childName" required />
              </label>
              <label>
                Child's age
                <select name="childAge" required defaultValue="">
                  <option value="" disabled>Select age</option>
                  {Array.from({ length: 10 }, (_, index) => index + 8).map((age) => (
                    <option value={age} key={age}>{age}</option>
                  ))}
                </select>
              </label>
              <label>
                School grade / year
                <input name="grade" placeholder="e.g. Grade 5 / Year 6" required />
              </label>
              <label>
                Country
                <input
                  name="country"
                  defaultValue={countryName(pricing.country)}
                  autoComplete="country-name"
                  required
                />
              </label>
              <label>
                City / suburb
                <input name="city" defaultValue={pricing.city} autoComplete="address-level2" required />
              </label>
            </div>

            <div className={styles.paymentMethods}>
              <label className={paymentMethod === "paypal" ? styles.paymentActive : ""}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                />
                <span>
                  <strong>PayPal</strong>
                  <small>
                    Secure online payment in USD
                    {selectedPrice ? ` · $${selectedPrice.paypalUsd.toFixed(2)}` : ""}
                  </small>
                </span>
              </label>

              {pricing.bankTransferAvailable && (
                <label className={paymentMethod === "bank" ? styles.paymentActive : ""}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                  />
                  <span>
                    <strong>FNB bank transfer</strong>
                    <small>Account details and a unique reference are emailed to you</small>
                  </span>
                </label>
              )}
            </div>

            <label className={styles.consent}>
              <input type="checkbox" required />
              <span>
                I am the learner's parent or legal guardian and agree to be contacted about onboarding, scheduling and payment.
              </span>
            </label>

            {status.type === "error" && <p className={styles.formError}>{status.message}</p>}

            <button className={styles.checkoutButton} type="submit" disabled={status.type === "loading"}>
              {status.type === "loading"
                ? "Preparing your booking…"
                : paymentMethod === "paypal"
                  ? "Continue to PayPal"
                  : "Email bank details"}
              <Arrow />
            </button>
            <p className={styles.checkoutNote}>
              Displayed local prices are server-calculated. PayPal settles in USD because ZAR and NGN are not supported PayPal checkout currencies.
            </p>
          </form>
        )}
      </aside>
    </div>
  );
}
