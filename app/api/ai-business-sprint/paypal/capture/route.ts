import { NextResponse } from "next/server";
import { aiSprintConfig } from "../../../../_lib/ai-business-sprint";
import {
  notifyAiSprintPaymentAdmin,
  sendAiSprintPaymentConfirmation,
} from "../../../../_lib/email";
import { capturePayPalOrder, PayPalApiError } from "../../../../_lib/paypal";

export const runtime = "nodejs";

type CaptureResult = {
  reference: string;
  amount: string;
  orderId: string;
};

async function completePayment(
  orderId: string,
  suppliedReference: string,
  suppliedCustomer?: { email?: string; name?: string },
): Promise<CaptureResult> {
  const capture = await capturePayPalOrder(orderId);
  const purchaseUnit = capture.purchase_units?.[0];
  const completedCapture = purchaseUnit?.payments?.captures?.[0];
  const reference = purchaseUnit?.reference_id || suppliedReference;
  const amountValue = completedCapture?.amount?.value;
  const currency = completedCapture?.amount?.currency_code;

  if (!reference.startsWith("IL-AI-")) {
    throw new Error(
      "The captured PayPal order is not an AI Business Sprint registration.",
    );
  }

  if (
    suppliedReference &&
    suppliedReference.startsWith("IL-AI-") &&
    suppliedReference !== reference
  ) {
    throw new Error(
      "The PayPal order reference does not match this registration.",
    );
  }

  if (
    currency !== "USD" ||
    !amountValue ||
    Number(amountValue).toFixed(2) !== aiSprintConfig.paypalUsd.toFixed(2)
  ) {
    throw new Error(
      "The captured PayPal amount does not match the class price.",
    );
  }

  const paypalPayerName = [
    capture.payer?.name?.given_name,
    capture.payer?.name?.surname,
  ]
    .filter(Boolean)
    .join(" ");
  const payerName = paypalPayerName || suppliedCustomer?.name?.trim() || "";
  const payerEmail =
    capture.payer?.email_address ||
    suppliedCustomer?.email?.trim().toLowerCase();
  const amount = `${currency} ${Number(amountValue).toFixed(2)}`;

  await Promise.all([
    sendAiSprintPaymentConfirmation({
      email: payerEmail,
      name: payerName,
      reference,
      amount,
      classDate: aiSprintConfig.classDate,
      classTime: aiSprintConfig.classTime,
    }).catch(() => false),
    notifyAiSprintPaymentAdmin({
      reference,
      paypalOrderId: capture.id || orderId,
      captureId: completedCapture?.id,
      payerEmail,
      payerName,
      amount,
    }).catch(() => false),
  ]);

  return {
    reference,
    amount,
    orderId: capture.id || orderId,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderId?: string;
      reference?: string;
      email?: string;
      name?: string;
    };
    const orderId = body.orderId?.trim();
    const reference = body.reference?.trim() || "IL-AI-PAYPAL";

    if (!orderId) {
      return NextResponse.json(
        { message: "The PayPal order ID is missing." },
        { status: 400 },
      );
    }

    const email =
      typeof body.email === "string" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
        ? body.email.trim().toLowerCase().slice(0, 160)
        : undefined;
    const name =
      typeof body.name === "string"
        ? body.name.trim().slice(0, 160)
        : undefined;

    const result = await completePayment(orderId, reference, { email, name });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("AI Business Sprint PayPal capture failed", error);

    const status =
      error instanceof PayPalApiError
        ? error.status >= 400 && error.status < 500
          ? error.status
          : 502
        : 400;

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "The PayPal payment could not be confirmed.",
      },
      { status },
    );
  }
}

// PayPal redirects the buyer here after approval on its hosted checkout page.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const suppliedReference = url.searchParams.get("reference") || "IL-AI-PAYPAL";

  if (!token) {
    return NextResponse.redirect(
      new URL(
        `/ai-business-sprint/cancelled?reference=${encodeURIComponent(suppliedReference)}`,
        url.origin,
      ),
    );
  }

  try {
    const result = await completePayment(token, suppliedReference);
    const confirmedUrl = new URL("/ai-business-sprint/confirmed", url.origin);
    confirmedUrl.searchParams.set("reference", result.reference);
    return NextResponse.redirect(confirmedUrl);
  } catch (error) {
    console.error("AI Business Sprint PayPal redirect capture failed", error);
    const cancelledUrl = new URL("/ai-business-sprint/cancelled", url.origin);
    cancelledUrl.searchParams.set("reference", suppliedReference);
    cancelledUrl.searchParams.set("reason", "capture_failed");
    return NextResponse.redirect(cancelledUrl);
  }
}
