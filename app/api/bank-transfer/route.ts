import { NextResponse } from "next/server";
import { createBookingReference, validateBookingInput } from "../../_lib/booking";
import {
  notifyBookingAdmin,
  sendBankTransferInstructions,
} from "../../_lib/email";
import { resolveVerifiedPrice } from "../../_lib/pricing";

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
    if (!verified || verified.market !== "ZA") {
      return NextResponse.json(
        { message: "FNB transfer is currently available only for South African bookings." },
        { status: 400 },
      );
    }

    const reference = createBookingReference(verified.programme.shortCode);
    const emailInput = {
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
      paymentMethod: "bank" as const,
      displayedPrice: verified.price.localFormatted,
    };

    const sent = await sendBankTransferInstructions({
      ...emailInput,
      amount: verified.price.localFormatted,
    });

    if (!sent) {
      return NextResponse.json(
        { message: "Bank-transfer email is not configured yet. Please contact Imaginelabs on WhatsApp." },
        { status: 503 },
      );
    }

    await notifyBookingAdmin(emailInput);
    return NextResponse.json({ reference });
  } catch {
    return NextResponse.json(
      { message: "The bank-transfer booking could not be prepared." },
      { status: 500 },
    );
  }
}
