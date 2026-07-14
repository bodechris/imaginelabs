import { NextResponse } from "next/server";

type RegisterPayload = {
  firstName?: unknown;
  lastName?: unknown;
  companyName?: unknown;
  workEmail?: unknown;
  workPhone?: unknown;
  goal?: unknown;
  paymentMethod?: unknown;
  reference?: unknown;
};

type RegistrationInput = {
  reference: string;
  firstName: string;
  lastName: string;
  companyName: string;
  workEmail: string;
  workPhone: string;
  goal: string;
  paymentMethod: string;
};

function clean(value: unknown, max = 220) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

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
        programme: "imaginelabs AI Business Sprint",
        class_date: "Saturday, 1 August",
        class_time: "10:00 AM - 1:00 PM SAST",
        reference: input.reference,
        company_name: input.companyName,
        work_phone: input.workPhone,
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
      subject: "Your imaginelabs AI Business Sprint registration",
      content_type: "html",
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        company_name: input.companyName,
        reference: input.reference,
        payment_method: input.paymentMethod,
        class_date: "Saturday, 1 August",
        class_time: "10:00 AM - 1:00 PM SAST",
        price: "R950",
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
      subject: `New AI Business Sprint registration - ${input.Reference}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#15101e">
          <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#582998">imaginelabs AI Business Sprint</p>
          <h1 style="font-size:34px;line-height:1.05;margin:0 0 24px">New registration</h1>
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
    const payload = (await request.json()) as RegisterPayload;
    const firstName = clean(payload.firstName, 80);
    const lastName = clean(payload.lastName, 80);
    const companyName = clean(payload.companyName, 120);
    const workEmail = clean(payload.workEmail, 120).toLowerCase();
    const workPhone = clean(payload.workPhone, 80);
    const goal = clean(payload.goal, 800);
    const reference = clean(payload.reference, 60) || "IL-AI-AUG01-SEAT";
    const paymentMethod =
      clean(payload.paymentMethod, 20) === "bank" ? "FNB deposit" : "PayPal";

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail);
    if (
      firstName.length < 2 ||
      lastName.length < 2 ||
      companyName.length < 2 ||
      !emailValid ||
      workPhone.length < 7 ||
      goal.length < 8
    ) {
      return NextResponse.json(
        { message: "Please complete all registration fields correctly." },
        { status: 400 },
      );
    }

    const registration: RegistrationInput = {
      reference,
      firstName,
      lastName,
      companyName,
      workEmail,
      workPhone,
      goal,
      paymentMethod,
    };

    const [emailSent, listmonkSynced, listmonkConfirmationSent] =
      await Promise.all([
        sendAdminEmail({
          Reference: reference,
          Name: `${firstName} ${lastName}`,
          Company: companyName,
          Email: workEmail,
          Phone: workPhone,
          Goal: goal,
          Payment: paymentMethod,
          Programme: "imaginelabs AI Business Sprint",
          Class: "Saturday, 1 August - 10:00 AM - 1:00 PM SAST",
          Price: "R950",
        }),
        addToListmonk(registration).catch(() => false),
        sendListmonkConfirmation(registration).catch(() => false),
      ]);

    return NextResponse.json({
      ok: true,
      reference,
      emailSent,
      listmonkSynced,
      listmonkConfirmationSent,
      message:
        emailSent || listmonkSynced
          ? "Registration received."
          : "Registration prepared. Please send your details on WhatsApp so we can confirm your seat.",
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "Registration could not be submitted. Please try WhatsApp instead.",
      },
      { status: 500 },
    );
  }
}
