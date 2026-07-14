import { NextResponse } from "next/server";
import { aiSprintConfig } from "../../../_lib/ai-business-sprint";
import { getPayPalConfiguration } from "../../../_lib/paypal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const paypal = getPayPalConfiguration();

  return NextResponse.json(
    {
      paypalConfigured: paypal.configured,
      paypalEnvironment: paypal.environment,
      paypalClientId: paypal.configured ? paypal.clientId : null,
      paypalAmountUsd: aiSprintConfig.paypalUsd,
      paypalPaymentMode: "standard_paypal_button",
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
