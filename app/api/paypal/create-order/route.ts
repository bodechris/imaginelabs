import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  AI_SPRINT_CURRENCY,
  AI_SPRINT_PRICE,
  paypalRequest,
  type PayPalOrder,
} from "@/lib/paypal";

function clean(value: unknown, max = 80) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      reference?: unknown;
      email?: unknown;
    };

    const reference = clean(payload.reference) || "IL-AI-SPRINT";
    const email = clean(payload.email, 120);

    const { response, data } = await paypalRequest<PayPalOrder>(
      "/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "PayPal-Request-Id": `ai-sprint-create-${randomUUID()}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: "ai-business-sprint",
              custom_id: reference,
              invoice_id: `${reference}-${randomUUID()}`.slice(0, 127),
              description: "imaginelabs AI Business Sprint",
              amount: {
                currency_code: AI_SPRINT_CURRENCY,
                value: AI_SPRINT_PRICE,
              },
            },
          ],
          payer: email
            ? {
                email_address: email,
              }
            : undefined,
          application_context: {
            brand_name: "imaginelabs",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
          },
        }),
      },
    );

    if (!response.ok || !data.id) {
      return NextResponse.json(
        {
          message: data.message || "Unable to create the PayPal order.",
        },
        { status: response.status || 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      orderId: data.id,
      currency: AI_SPRINT_CURRENCY,
      value: Number(AI_SPRINT_PRICE),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to create the PayPal order.",
      },
      { status: 500 },
    );
  }
}
