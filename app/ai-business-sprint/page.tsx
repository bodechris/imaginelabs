"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import PayPalCheckout from "@/components/PayPalCheckout";

const SPRINT_PRICE = 950;
const whatsappNumber = "27733110149";

type PaymentMethod = "paypal" | "bank";

type FormState = {
  firstName: string;
  lastName: string;
  companyName: string;
  workEmail: string;
  workPhone: string;
  goal: string;
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  companyName: "",
  workEmail: "",
  workPhone: "",
  goal: "",
};

const outcomes = [
  "Business AI profile prompt",
  "30-day content plan",
  "10 customer reply templates",
  "3 sales follow-ups",
  "One repeatable workflow / SOP",
  "Five on-brand AI images",
  "Lead tracker and review-request setup",
  "30-day action plan",
];

function slug(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 18);
}

export default function AiBusinessSprintPage() {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("paypal");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const reference = useMemo(() => {
    const name = slug(
      form.lastName || form.companyName || form.firstName || "SEAT",
    );
    return `IL-AI-AUG01-${name || "SEAT"}`;
  }, [form.companyName, form.firstName, form.lastName]);

  const whatsappLink = useMemo(() => {
    const message = [
      "Hi imaginelabs, I registered for the AI Business Sprint.",
      `Reference: ${reference}`,
      `Name: ${form.firstName} ${form.lastName}`.trim(),
      `Company: ${form.companyName}`,
      `Email: ${form.workEmail}`,
      `Payment: ${paymentMethod === "paypal" ? "PayPal" : "FNB deposit"}`,
      transactionId ? `PayPal transaction: ${transactionId}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [form, paymentMethod, reference, transactionId]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormMessage("");

    try {
      const response = await fetch("/api/ai-business-sprint/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, paymentMethod, reference }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to submit registration.");
      }

      // The lead is sent only after the registration API confirms success.
      sendGTMEvent({
        event: "generate_lead",
        program: "ai_business_sprint",
        lead_source: "website_registration",
      });

      setSubmitted(true);
      setFormMessage(data.message || "Registration received.");
    } catch (error) {
      setFormMessage(
        error instanceof Error
          ? error.message
          : "Registration could not be submitted. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <header className="siteHeader">
        <Link href="/" className="wordmark">
          imaginelabs
        </Link>
        <a href="#register" className="headerCta">
          Reserve a seat
        </a>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Monthly live online workshop</p>
          <h1>
            Use AI to make your small business feel <span>unfairly prepared.</span>
          </h1>
          <p className="lead">
            A practical three-hour sprint for content, customer replies, sales
            follow-ups, workflows and better brand visuals.
          </p>
          <div className="heroActions">
            <a href="#register" className="primaryButton">
              Register for R{SPRINT_PRICE}
            </a>
            <a href="#outcomes" className="secondaryButton">
              See the outcomes
            </a>
          </div>
        </div>

        <aside className="classCard">
          <p>AI Business Sprint</p>
          <strong>R{SPRINT_PRICE}</strong>
          <dl>
            <div>
              <dt>Date</dt>
              <dd>Saturday, 1 August</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>10:00 AM - 1:00 PM SAST</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>Live on Zoom / Google Meet</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="outcomes" id="outcomes">
        <p className="eyebrow">What you leave with</p>
        <h2>Useful business assets, not another lecture.</h2>
        <div className="outcomeGrid">
          {outcomes.map((outcome, index) => (
            <article key={outcome}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{outcome}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="register" id="register">
        <div className="registerIntro">
          <p className="eyebrow">Reserve your seat</p>
          <h2>Register first. Pay only after your details are saved.</h2>
          <p>
            The tracking events are attached to confirmed actions: registration
            success, valid PayPal order creation and backend-verified payment.
          </p>
          <div className="referenceBox">
            <span>Payment reference</span>
            <strong>{reference}</strong>
          </div>
        </div>

        <div className="formShell">
          <form onSubmit={handleSubmit}>
            <div className="formGrid">
              <label>
                First name
                <input
                  required
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                />
              </label>
              <label>
                Last name
                <input
                  required
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                />
              </label>
              <label>
                Company name
                <input
                  required
                  autoComplete="organization"
                  value={form.companyName}
                  onChange={(event) =>
                    updateField("companyName", event.target.value)
                  }
                />
              </label>
              <label>
                Work email
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={form.workEmail}
                  onChange={(event) =>
                    updateField("workEmail", event.target.value)
                  }
                />
              </label>
              <label className="fullField">
                Work phone / WhatsApp
                <input
                  required
                  autoComplete="tel"
                  value={form.workPhone}
                  onChange={(event) =>
                    updateField("workPhone", event.target.value)
                  }
                />
              </label>
              <label className="fullField">
                What do you want AI to help your business achieve?
                <textarea
                  required
                  value={form.goal}
                  onChange={(event) => updateField("goal", event.target.value)}
                  placeholder="Reply faster, create better content, improve follow-up..."
                />
              </label>
            </div>

            <div className="paymentToggle" aria-label="Payment method">
              <button
                type="button"
                className={paymentMethod === "paypal" ? "active" : ""}
                onClick={() => setPaymentMethod("paypal")}
              >
                PayPal
              </button>
              <button
                type="button"
                className={paymentMethod === "bank" ? "active" : ""}
                onClick={() => setPaymentMethod("bank")}
              >
                FNB deposit
              </button>
            </div>

            <button
              type="submit"
              className="submitButton"
              disabled={submitting || submitted}
            >
              {submitting
                ? "Saving registration..."
                : submitted
                  ? "Registration saved"
                  : "Register and continue"}
            </button>
          </form>

          {formMessage ? (
            <p className={submitted ? "successMessage" : "errorMessage"}>
              {formMessage}
            </p>
          ) : null}

          {submitted && paymentMethod === "paypal" && !transactionId ? (
            <div className="paymentPanel">
              <h3>Complete your PayPal payment</h3>
              <p>
                Checkout begins only after PayPal creates a valid order. The
                purchase event is sent only after the backend verifies the capture.
              </p>
              <PayPalCheckout
                reference={reference}
                email={form.workEmail}
                onSuccess={setTransactionId}
              />
            </div>
          ) : null}

          {submitted && paymentMethod === "bank" ? (
            <div className="paymentPanel">
              <h3>Pay by FNB deposit</h3>
              <p>
                Use <strong>{reference}</strong> as the payment reference, then
                send proof through WhatsApp.
              </p>
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                Send registration on WhatsApp
              </a>
            </div>
          ) : null}

          {transactionId ? (
            <div className="paymentSuccess" role="status">
              <p className="eyebrow">Payment confirmed</p>
              <h3>Your seat is reserved.</h3>
              <p>Transaction: {transactionId}</p>
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                Send confirmation on WhatsApp
              </a>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
