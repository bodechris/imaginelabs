import { NextResponse } from "next/server";
import {
  AI_SPRINT_CURRENCY,
  AI_SPRINT_PRICE,
  paypalRequest,
  type PayPalOrder,
  verifySprintCapture,
} from "@/lib/paypal";

function cleanOrderId(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[^A-Za-z0-9-]/g, "").slice(0, 40);
}

async function readOrder(orderId: string) {
  return paypalRequest<PayPalOrder>(`/v2/checkout/orders/${orderId}`, {
    method: "GET",
  });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { orderId?: unknown };
    const orderId = cleanOrderId(payload.orderId);

    if (!orderId) {
      return NextResponse.json(
        { message: "A valid PayPal order ID is required." },
        { status: 400 },
      );
    }

    const captureResult = await paypalRequest<PayPalOrder>(
      `/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          // The stable request ID makes repeated capture calls idempotent.
          "PayPal-Request-Id": `ai-sprint-capture-${orderId}`,
          Prefer: "return=representation",
        },
        body: "{}",
      },
    );

    let order = captureResult.data;

    // PayPal can return an error when a completed order is captured again.
    // Read the order and verify its actual state rather than recording twice.
    if (!captureResult.response.ok) {
      const issue = order.details?.[0]?.issue;
      if (issue === "ORDER_ALREADY_CAPTURED" || captureResult.response.status === 422) {
        const readResult = await readOrder(orderId);
        order = readResult.data;
      } else {
        return NextResponse.json(
          { message: order.message || "PayPal could not capture this order." },
          { status: captureResult.response.status || 500 },
        );
      }
    }

    const result = verifySprintCapture(order);

    if (!result.verified || !result.transactionId) {
      return NextResponse.json(
        {
          message:
            "The PayPal capture was not verified for the expected ZAR 950 payment.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      ok: true,
      verified: true,
      orderId,
      transactionId: result.transactionId,
      currency: AI_SPRINT_CURRENCY,
      value: Number(AI_SPRINT_PRICE),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to verify the PayPal payment.",
      },
      { status: 500 },
    );
  }
}
