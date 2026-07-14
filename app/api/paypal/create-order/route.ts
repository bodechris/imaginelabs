import { NextResponse } from "next/server";
import { createBookingReference, validateBookingInput } from "../../../_lib/booking";
import { notifyBookingAdmin } from "../../../_lib/email";
import { createPayPalOrder } from "../../../_lib/paypal";
import { resolveVerifiedPrice } from "../../../_lib/pricing";

export async function POST(request: Request) {
  try {
    const body = validateBookingInput(await request.json());
    if (!body) {
      return NextResponse.json(
        { message: "Please complete all booking fields correctly." },
        { status: 400 },
      );
    }

    const verified = await resolveVerifiedPrice({
      offerToken: body.offerToken,
      programmeId: body.programmeId,
      planId: body.planId,
    });
    if (!verified) {
      return NextResponse.json(
        { message: "This price has expired. Refresh the page and try again." },
        { status: 400 },
      );
    }

    const reference = createBookingReference(verified.programme.shortCode);
    const url = new URL(request.url);
    const returnUrl = new URL("/api/paypal/capture", url.origin);
    returnUrl.searchParams.set("reference", reference);
    const cancelUrl = new URL("/booking/cancelled", url.origin);
    cancelUrl.searchParams.set("reference", reference);

    const order = await createPayPalOrder({
      amountUsd: verified.price.paypalUsd,
      description: `${verified.programme.title} · ${verified.price.sessions} sessions per month`,
      reference,
      returnUrl: returnUrl.toString(),
      cancelUrl: cancelUrl.toString(),
    });

    await notifyBookingAdmin({
      reference,
      parentName: body.parentName,
      parentEmail: body.parentEmail,
      phone: body.phone,
      childName: body.childName,
      childAge: body.childAge,
      grade: body.grade,
      country: body.country,
      city: body.city,
      programme: verified.programme.title,
      plan: `${verified.price.sessions} sessions / month`,
      paymentMethod: "paypal",
      displayedPrice: `${verified.price.localFormatted} / $${verified.price.paypalUsd.toFixed(2)} PayPal`,
    });

    return NextResponse.json({ approveUrl: order.approveUrl, reference });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "PayPal checkout could not be started.",
      },
      { status: 500 },
    );
  }
}
