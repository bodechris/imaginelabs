import { NextResponse } from "next/server";
import {
  aiSprintConfig,
  createAiSprintReference,
  type AiSprintRegistration,
  type AiSprintRegistrationPayload,
  validateAiSprintRegistration,
} from "../../../_lib/ai-business-sprint";
import {
  createStandardPayPalButtonOrder,
  PayPalApiError,
} from "../../../_lib/paypal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

function paymentLabel(method: RegistrationInput["paymentMethod"]) {
  return method === "bank" ? "FNB deposit" : "PayPal";
}

async function addToListmonk(input: RegistrationInput) {
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
        payment_method: paymentLabel(input.paymentMethod),
        goal: input.goal,
        marketing_consent: input.marketingConsent,
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
      subject: "Your imaginelabs AI Business Sprint registration",
      content_type: "html",
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        company_name: input.companyName,
        reference: input.reference,
        payment_method: paymentLabel(input.paymentMethod),
        class_date: aiSprintConfig.classDate,
        class_time: aiSprintConfig.classTime,
        price: `R${aiSprintConfig.priceZar}`,
        paypal_price: `USD ${aiSprintConfig.paypalUsd.toFixed(2)}`,
        whatsapp: "0733110149",
      },
    }),
    cache: "no-store",
  });

  return response.ok;
}

async function sendAdminEmail(input: RegistrationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  const admin = process.env.BOOKING_ADMIN_EMAIL || "imaginelabs@bodilum.com";
  if (!apiKey || !from || !admin) return false;

  const rows = [
    ["Reference", input.reference],
    ["Name", `${input.firstName} ${input.lastName}`],
    ["Company", input.companyName],
    ["Business type", input.businessType],
    ["Role", input.jobTitle || "—"],
    ["Email", input.workEmail],
    ["Phone", input.workPhone],
    ["Location", [input.city, input.country].filter(Boolean).join(", ")],
    ["Website / social", input.websiteOrSocial || "—"],
    ["Goal", input.goal],
    ["Payment", paymentLabel(input.paymentMethod)],
    ["Marketing consent", input.marketingConsent ? "Yes" : "No"],
    ["Programme", aiSprintConfig.programme],
    ["Class", `${aiSprintConfig.classDate} · ${aiSprintConfig.classTime}`],
    ["Price", `R${aiSprintConfig.priceZar}`],
  ];

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 18px 8px 0;color:#582998;font-weight:700">${escapeHtml(label)}</td><td style="padding:8px 0;color:#15101e">${escapeHtml(value)}</td></tr>`,
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
      subject: `New AI Business Sprint registration - ${input.reference}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#15101e">
          <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#582998">imaginelabs AI Business Sprint</p>
          <h1 style="font-size:34px;line-height:1.05;margin:0 0 24px">New registration</h1>
          <table style="border-collapse:collapse;width:100%">${htmlRows}</table>
        </div>
      `,
    }),
    cache: "no-store",
  });

  return response.ok;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as AiSprintRegistrationPayload;
    const registration = validateAiSprintRegistration(payload);

    if (!registration) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Please complete all required registration fields correctly.",
        },
        { status: 400 },
      );
    }

    const reference = createAiSprintReference();
    const input: RegistrationInput = { ...registration, reference };

    let paypalOrderId: string | null = null;

    if (registration.paymentMethod === "paypal") {
      const order = await createStandardPayPalButtonOrder({
        amountUsd: aiSprintConfig.paypalUsd,
        description: aiSprintConfig.programme,
        itemName: "AI Business Sprint",
        reference,
        buyer: {
          emailAddress: registration.workEmail,
          givenName: registration.firstName,
          surname: registration.lastName,
          phone: registration.workPhone,
          country: registration.country,
        },
      });

      paypalOrderId = order.orderId;
    }

    const [emailSent, listmonkSynced, listmonkConfirmationSent] =
      await Promise.all([
        sendAdminEmail(input).catch(() => false),
        addToListmonk(input).catch(() => false),
        sendListmonkConfirmation(input).catch(() => false),
      ]);

    return NextResponse.json(
      {
        ok: true,
        reference,
        paypalCheckoutMode:
          registration.paymentMethod === "paypal"
            ? "standard_paypal_button"
            : null,
        paypalOrderId,
        currency: registration.paymentMethod === "paypal" ? "USD" : "ZAR",
        value:
          registration.paymentMethod === "paypal"
            ? aiSprintConfig.paypalUsd
            : Number(aiSprintConfig.priceZar),
        priceZar: Number(aiSprintConfig.priceZar),
        emailSent,
        listmonkSynced,
        listmonkConfirmationSent,
        message:
          registration.paymentMethod === "paypal"
            ? "Registration received. Continue with the secure PayPal button below."
            : "Registration received. Use the generated reference for your FNB payment.",
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("AI Business Sprint registration failed", error);

    const status = error instanceof PayPalApiError ? 502 : 500;

    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Registration could not be submitted. Please try WhatsApp instead.",
      },
      { status },
    );
  }
}
