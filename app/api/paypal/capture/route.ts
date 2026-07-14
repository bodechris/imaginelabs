import { NextResponse } from "next/server";
import { sendPaymentConfirmation } from "../../../_lib/email";
import { capturePayPalOrder } from "../../../_lib/paypal";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const suppliedReference = url.searchParams.get("reference") || "IL-PAYPAL";

  if (!token) {
    return NextResponse.redirect(
      new URL(`/booking/cancelled?reference=${encodeURIComponent(suppliedReference)}`, url.origin),
    );
  }

  try {
    const capture = await capturePayPalOrder(token);
    const reference =
      capture.purchase_units?.[0]?.reference_id || suppliedReference;
    const payerName = [
      capture.payer?.name?.given_name,
      capture.payer?.name?.surname,
    ]
      .filter(Boolean)
      .join(" ");

    await sendPaymentConfirmation({
      email: capture.payer?.email_address,
      name: payerName,
      reference,
    });

    return NextResponse.redirect(
      new URL(`/booking/confirmed?reference=${encodeURIComponent(reference)}`, url.origin),
    );
  } catch {
    return NextResponse.redirect(
      new URL(`/booking/cancelled?reference=${encodeURIComponent(suppliedReference)}`, url.origin),
    );
  }
}
