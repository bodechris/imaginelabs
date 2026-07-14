import { NextResponse } from "next/server";
import {
  aiSprintConfig,
  createAiSprintReference,
  validateAiSprintRegistration,
  type AiSprintRegistration,
} from "../../../_lib/ai-business-sprint";
import {
  createStandardPayPalButtonOrder,
  getPayPalConfiguration,
  PayPalApiError,
  PayPalConfigurationError,
} from "../../../_lib/paypal";

export const runtime = "nodejs";

type RegistrationInput = AiSprintRegistration & {
  reference: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function listmonkHeaders() {
  const user = process.env.LISTMONK_API_USER;
  const token = process.env.LISTMONK_API_TOKEN;

  if (!user || !token) return null;

  return {
    Authorization: `token ${user}:${token}`,
    "Content-Type": "application/json",
  };
}

function listmonkUrl(path: string) {
  const baseUrl = process.env.LISTMONK_URL?.replace(/\/$/, "");
  if (!baseUrl) return "";
  return `${baseUrl}${path}`;
}

async function addToListmonk(input: RegistrationInput) {
  if (!input.marketingConsent) return false;

  const headers = listmonkHeaders();
  const url = listmonkUrl("/api/subscribers");
  const listId = Number(process.env.LISTMONK_AI_SPRINT_LIST_ID || 0);

  if (!headers || !url || !listId) return false;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: input.workEmail,
      name: `${input.firstName} ${input.lastName}`,
      status: "enabled",
      lists: [listId],
      preconfirm_subscriptions: true,
      attribs: {
        source: "imaginelabs_ai_business_sprint_page",
        programme: aiSprintConfig.programme,
        class_date: aiSprintConfig.classDate,
        class_time: aiSprintConfig.classTime,
        reference: input.reference,
        company_name: input.companyName,
        business_type: input.businessType,
        job_title: input.jobTitle,
        work_phone: input.workPhone,
        country: input.country,
        city: input.city,
        website_or_social: input.websiteOrSocial,
        payment_method: input.paymentMethod,
        goal: input.goal,
      },
    }),
    cache: "no-store",
  });

  return response.ok;
}

async function sendListmonkConfirmation(input: RegistrationInput) {
  const headers = listmonkHeaders();
  const url = listmonkUrl("/api/tx");
  const templateId = Number(process.env.LISTMONK_AI_SPRINT_TX_TEMPLATE_ID || 0);

  if (!headers || !url || !templateId) return false;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      subscriber_email: input.workEmail,
      subscriber_mode: "fallback",
      template_id: templateId,
      subject:
        input.paymentMethod === "paypal"
          ? "Complete your imaginelabs AI Business Sprint payment"
          : "Your imaginelabs AI Business Sprint registration reference",
      content_type: "html",
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        company_name: input.companyName,
        business_type: input.businessType,
        reference: input.reference,
        payment_method:
          input.paymentMethod === "paypal" ? "PayPal" : "FNB deposit",
        class_date: aiSprintConfig.classDate,
        class_time: aiSprintConfig.classTime,
        price: `R${aiSprintConfig.priceZar}`,
        paypal_price: `$${aiSprintConfig.paypalUsd.toFixed(2)}`,
        whatsapp: "0733110149",
      },
    }),
    cache: "no-store",
  });

  return response.ok;
}

async function sendAdminEmail(input: Record<string, string>) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  const admin = process.env.BOOKING_ADMIN_EMAIL || "imaginelabs@bodilum.com";
  if (!apiKey || !from || !admin) return false;

  const rows = Object.entries(input)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 18px 8px 0;color:#582998;font-weight:700;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 0;color:#15101e">${escapeHtml(value || "—")}</td></tr>`,
    )
    .join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [admin],
      subject: `New AI Business Sprint order · ${input.Reference}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#15101e">
          <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#582998">imaginelabs AI Business Sprint</p>
          <h1 style="font-size:34px;line-height:1.05;margin:0 0 24px">New registration / pending payment</h1>
          <table style="border-collapse:collapse;width:100%">${rows}</table>
        </div>
      `,
    }),
    cache: "no-store",
  });

  return response.ok;
}

export async function POST(request: Request) {
  try {
    const registration = validateAiSprintRegistration(await request.json());
    if (!registration) {
      return NextResponse.json(
        {
          message:
            "Please complete all required registration fields correctly.",
        },
        { status: 400 },
      );
    }

    const reference = createAiSprintReference();
    const input: RegistrationInput = { ...registration, reference };
    let paypalOrderId: string | undefined;

    if (registration.paymentMethod === "paypal") {
      const paypal = getPayPalConfiguration();
      if (!paypal.configured) {
        throw new PayPalConfigurationError(
          "PayPal checkout is not configured yet. Add the PayPal sandbox credentials to .env.local and restart the development server, or select FNB deposit for now.",
        );
      }

      const paypalOrder = await createStandardPayPalButtonOrder({
        amountUsd: aiSprintConfig.paypalUsd,
        reference,
        itemName: "Imaginelabs AI Business Sprint seat",
        description: `${aiSprintConfig.programme} · ${registration.companyName} · ${aiSprintConfig.classDate}`,
        buyer: {
          emailAddress: registration.workEmail,
          givenName: registration.firstName,
          surname: registration.lastName,
          phone: registration.workPhone,
          country: registration.country,
        },
      });
      paypalOrderId = paypalOrder.orderId;
    }

    const paymentLabel =
      registration.paymentMethod === "paypal"
        ? `PayPal · $${aiSprintConfig.paypalUsd.toFixed(2)}`
        : `FNB deposit · R${aiSprintConfig.priceZar}`;

    const [emailSent, listmonkSynced, listmonkConfirmationSent] =
      await Promise.all([
        sendAdminEmail({
          Reference: reference,
          "PayPal order":
            registration.paymentMethod === "paypal"
              ? paypalOrderId || "Created"
              : "Not applicable",
          Name: `${registration.firstName} ${registration.lastName}`,
          Company: registration.companyName,
          "Business type": registration.businessType,
          "Role / title": registration.jobTitle,
          Email: registration.workEmail,
          "Phone / WhatsApp": registration.workPhone,
          Country: registration.country,
          City: registration.city,
          "Website / social": registration.websiteOrSocial,
          Goal: registration.goal,
          Payment: paymentLabel,
          Programme: aiSprintConfig.programme,
          Class: `${aiSprintConfig.classDate} · ${aiSprintConfig.classTime}`,
          "Marketing consent": registration.marketingConsent ? "Yes" : "No",
          Status: "Pending payment",
        }).catch(() => false),
        addToListmonk(input).catch(() => false),
        sendListmonkConfirmation(input).catch(() => false),
      ]);

    return NextResponse.json({
      ok: true,
      reference,
      paypalCheckoutMode:
        registration.paymentMethod === "paypal"
          ? "standard_paypal_button"
          : undefined,
      paypalOrderId,
      emailSent,
      listmonkSynced,
      listmonkConfirmationSent,
      message:
        registration.paymentMethod === "paypal"
          ? "Your order reference has been created. Select the PayPal button below to open PayPal's secure checkout. Eligible customers can choose debit or credit card during checkout."
          : "Your registration reference has been created. Use it exactly as shown for the FNB deposit.",
    });
  } catch (error) {
    console.error("AI Business Sprint registration failed", error);

    const status =
      error instanceof PayPalConfigurationError
        ? 503
        : error instanceof PayPalApiError
          ? error.status >= 400 && error.status < 500
            ? error.status
            : 502
          : 500;

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Registration could not be submitted. Please try WhatsApp instead.",
      },
      { status },
    );
  }
}
