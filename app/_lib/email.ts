type BookingEmailInput = {
  reference: string;
  parentName: string;
  parentEmail: string;
  phone: string;
  childName: string;
  childAge: string;
  grade: string;
  country: string;
  city: string;
  programme: string;
  plan: string;
  paymentMethod: "paypal" | "bank";
  displayedPrice: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendEmail(input: {
  to: string[];
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  if (!apiKey || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, ...input }),
    cache: "no-store",
  });
  return response.ok;
}

export async function notifyBookingAdmin(input: BookingEmailInput) {
  const admin = process.env.BOOKING_ADMIN_EMAIL;
  if (!admin) return false;
  const rows = [
    ["Reference", input.reference],
    ["Parent", input.parentName],
    ["Email", input.parentEmail],
    ["Phone", input.phone],
    ["Child", input.childName],
    ["Age", input.childAge],
    ["Grade / year", input.grade],
    ["Country", input.country],
    ["City / suburb", input.city],
    ["Programme", input.programme],
    ["Plan", input.plan],
    ["Payment", input.paymentMethod],
    ["Displayed price", input.displayedPrice],
  ];

  return sendEmail({
    to: [admin],
    subject: `New Imaginelabs booking · ${input.reference}`,
    html: `<h1>New booking</h1><table>${rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 16px 6px 0"><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`,
      )
      .join("")}</table>`,
  });
}

export async function sendBankTransferInstructions(
  input: BookingEmailInput & { amount: string },
) {
  const accountName = process.env.FNB_ACCOUNT_NAME;
  const accountNumber = process.env.FNB_ACCOUNT_NUMBER;
  const accountType = process.env.FNB_ACCOUNT_TYPE;
  const branchCode = process.env.FNB_BRANCH_CODE;
  if (!accountName || !accountNumber || !branchCode) return false;

  return sendEmail({
    to: [input.parentEmail],
    subject: `Your Imaginelabs booking reference · ${input.reference}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#15101e">
        <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#582998">Imaginelabs by Bodilum</p>
        <h1 style="font-size:34px;line-height:1.05">Your place is awaiting payment.</h1>
        <p>Hello ${escapeHtml(input.parentName)},</p>
        <p>Use the details below to pay for <strong>${escapeHtml(input.programme)}</strong>. Your booking is confirmed after the payment reflects or proof of payment is verified.</p>
        <div style="background:#f2ecfa;padding:24px;border-radius:18px;margin:24px 0">
          <p><strong>Amount:</strong> ${escapeHtml(input.amount)}</p>
          <p><strong>Bank:</strong> FNB</p>
          <p><strong>Account name:</strong> ${escapeHtml(accountName)}</p>
          <p><strong>Account number:</strong> ${escapeHtml(accountNumber)}</p>
          <p><strong>Account type:</strong> ${escapeHtml(accountType || "Business")}</p>
          <p><strong>Branch code:</strong> ${escapeHtml(branchCode)}</p>
          <p><strong>Payment reference:</strong> ${escapeHtml(input.reference)}</p>
        </div>
        <p>Please use the reference exactly as shown so we can match the payment quickly.</p>
      </div>`,
  });
}

export async function sendPaymentConfirmation(input: {
  email?: string;
  name?: string;
  reference: string;
}) {
  if (!input.email) return false;
  return sendEmail({
    to: [input.email],
    subject: `Imaginelabs payment confirmed · ${input.reference}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#15101e"><p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#582998">Imaginelabs by Bodilum</p><h1>Payment confirmed.</h1><p>Hello ${escapeHtml(input.name || "there")},</p><p>Thank you. We received your payment and will contact you with the learner onboarding details.</p><p><strong>Reference:</strong> ${escapeHtml(input.reference)}</p></div>`,
  });
}

export async function sendAiSprintPaymentConfirmation(input: {
  email?: string;
  name?: string;
  reference: string;
  amount: string;
  classDate: string;
  classTime: string;
}) {
  if (!input.email) return false;
  return sendEmail({
    to: [input.email],
    subject: `Your AI Business Sprint seat is confirmed · ${input.reference}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#15101e">
        <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#582998">Imaginelabs by Bodilum</p>
        <h1 style="font-size:34px;line-height:1.05">Your seat is confirmed.</h1>
        <p>Hello ${escapeHtml(input.name || "there")},</p>
        <p>Thank you. Your PayPal payment for the <strong>Imaginelabs AI Business Sprint</strong> was completed successfully.</p>
        <div style="background:#f2ecfa;padding:24px;border-radius:18px;margin:24px 0">
          <p><strong>Reference:</strong> ${escapeHtml(input.reference)}</p>
          <p><strong>Amount:</strong> ${escapeHtml(input.amount)}</p>
          <p><strong>Class date:</strong> ${escapeHtml(input.classDate)}</p>
          <p><strong>Class time:</strong> ${escapeHtml(input.classTime)}</p>
        </div>
        <p>We will contact you with onboarding instructions, the joining link and what to prepare before the class.</p>
      </div>`,
  });
}

export async function notifyAiSprintPaymentAdmin(input: {
  reference: string;
  paypalOrderId?: string;
  captureId?: string;
  payerEmail?: string;
  payerName?: string;
  amount: string;
}) {
  const admin = process.env.BOOKING_ADMIN_EMAIL || "imaginelabs@bodilum.com";
  if (!admin) return false;

  return sendEmail({
    to: [admin],
    subject: `AI Business Sprint payment confirmed · ${input.reference}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#15101e">
        <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#582998">Imaginelabs AI Business Sprint</p>
        <h1 style="font-size:34px;line-height:1.05">PayPal payment confirmed</h1>
        <p><strong>Reference:</strong> ${escapeHtml(input.reference)}</p>
        <p><strong>Order ID:</strong> ${escapeHtml(input.paypalOrderId || "—")}</p>
        <p><strong>Capture ID:</strong> ${escapeHtml(input.captureId || "—")}</p>
        <p><strong>Payer:</strong> ${escapeHtml(input.payerName || "—")}</p>
        <p><strong>Payer email:</strong> ${escapeHtml(input.payerEmail || "—")}</p>
        <p><strong>Amount:</strong> ${escapeHtml(input.amount)}</p>
      </div>`,
  });
}
