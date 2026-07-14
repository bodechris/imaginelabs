const PAYPAL_ENV = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";
const PAYPAL_API =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export class PayPalConfigurationError extends Error {
  constructor(message = "PayPal is not configured.") {
    super(message);
    this.name = "PayPalConfigurationError";
  }
}

export class PayPalApiError extends Error {
  status: number;
  debugId?: string;

  constructor(message: string, status: number, debugId?: string) {
    super(message);
    this.name = "PayPalApiError";
    this.status = status;
    this.debugId = debugId;
  }
}

export function getPayPalConfiguration() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();

  return {
    environment: PAYPAL_ENV,
    configured: Boolean(clientId && clientSecret),
    clientId: clientId || "",
    missing: [
      !clientId ? "PAYPAL_CLIENT_ID" : "",
      !clientSecret ? "PAYPAL_CLIENT_SECRET" : "",
    ].filter(Boolean),
  };
}

type PayPalErrorPayload = {
  message?: string;
  debug_id?: string;
  details?: Array<{ description?: string; issue?: string; field?: string }>;
};

async function readPayPalError(response: Response) {
  let payload: PayPalErrorPayload = {};

  try {
    payload = await response.json();
  } catch {
    // PayPal can occasionally return an empty or non-JSON error response.
  }

  const detail = payload.details?.[0];
  const message =
    detail?.description ||
    payload.message ||
    `PayPal request failed with status ${response.status}.`;

  return {
    message,
    debugId: payload.debug_id,
    detail,
  };
}

export async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new PayPalConfigurationError(
      "PayPal checkout is not configured yet. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to .env.local, then restart the development server.",
    );
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await readPayPalError(response);
    console.error("PayPal authentication failed", {
      environment: PAYPAL_ENV,
      status: response.status,
      debugId: error.debugId,
      detail: error.detail,
    });
    throw new PayPalApiError(
      PAYPAL_ENV === "sandbox"
        ? "PayPal sandbox authentication failed. Check that the sandbox Client ID and Secret are copied correctly and that PAYPAL_ENV is set to sandbox."
        : "PayPal live authentication failed. Check that the live Client ID and Secret are copied correctly and that PAYPAL_ENV is set to live.",
      response.status,
      error.debugId,
    );
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new PayPalApiError("PayPal did not return an access token.", 502);
  }

  return data.access_token;
}

type PayPalBuyerPrefill = {
  emailAddress?: string;
  givenName?: string;
  surname?: string;
  phone?: string;
  country?: string;
};

type OrderItemInput = {
  amountUsd: number;
  description: string;
  reference: string;
  itemName?: string;
  buyer?: PayPalBuyerPrefill;
};

const countryCallingCodes: Record<string, string> = {
  "south africa": "27",
  za: "27",
  nigeria: "234",
  ng: "234",
  "united kingdom": "44",
  uk: "44",
  gb: "44",
  "united states": "1",
  "united states of america": "1",
  usa: "1",
  us: "1",
  canada: "1",
  ca: "1",
};

const knownCallingCodes = ["234", "27", "44", "1"];

function cleanBuyerText(value: string | undefined, max: number) {
  return value?.trim().slice(0, max) || "";
}

function normalisePayPalPhone(phone?: string, country?: string) {
  const raw = phone?.trim() || "";
  if (!raw) return undefined;

  const digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;

  const countryKey = (country || "").trim().toLowerCase();
  let countryCode = countryCallingCodes[countryKey] || "";
  let nationalNumber = digits;

  if (raw.startsWith("+")) {
    countryCode =
      knownCallingCodes.find((code) => digits.startsWith(code)) || countryCode;
  }

  if (!countryCode) return undefined;

  if (nationalNumber.startsWith(countryCode)) {
    nationalNumber = nationalNumber.slice(countryCode.length);
  }

  nationalNumber = nationalNumber.replace(/^0+/, "");

  if (nationalNumber.length < 6 || nationalNumber.length > 14) {
    return undefined;
  }

  return {
    phone_type: "MOBILE",
    phone_number: {
      country_code: countryCode,
      national_number: nationalNumber,
    },
  };
}

function buildPayPalWallet(input: OrderItemInput) {
  const buyer = input.buyer;
  const emailAddress = cleanBuyerText(buyer?.emailAddress, 254);
  const givenName = cleanBuyerText(buyer?.givenName, 140);
  const surname = cleanBuyerText(buyer?.surname, 140);
  const phone = normalisePayPalPhone(buyer?.phone, buyer?.country);

  return {
    ...(emailAddress ? { email_address: emailAddress } : {}),
    ...(givenName || surname
      ? {
          name: {
            ...(givenName ? { given_name: givenName } : {}),
            ...(surname ? { surname } : {}),
          },
        }
      : {}),
    ...(phone ? { phone } : {}),
    experience_context: {
      brand_name:
        process.env.PAYPAL_BRAND_NAME?.trim() || "Imaginelabs by Bodilum",
      shipping_preference: "NO_SHIPPING",
      user_action: "PAY_NOW",
    },
  };
}

function validateOrderInput(input: OrderItemInput) {
  if (!Number.isFinite(input.amountUsd) || input.amountUsd <= 0) {
    throw new PayPalConfigurationError(
      "The PayPal amount is not configured correctly. Set the relevant PayPal USD price to a number greater than zero.",
    );
  }

  if (!input.reference.trim()) {
    throw new PayPalConfigurationError("A PayPal order reference is required.");
  }
}

function buildPurchaseUnit(input: OrderItemInput) {
  const amount = input.amountUsd.toFixed(2);

  return {
    reference_id: input.reference,
    custom_id: input.reference,
    invoice_id: input.reference,
    description: input.description.slice(0, 127),
    amount: {
      currency_code: "USD",
      value: amount,
      breakdown: {
        item_total: {
          currency_code: "USD",
          value: amount,
        },
      },
    },
    items: [
      {
        name: (input.itemName || input.description).slice(0, 127),
        description: input.description.slice(0, 127),
        quantity: "1",
        category: "DIGITAL_GOODS",
        unit_amount: {
          currency_code: "USD",
          value: amount,
        },
      },
    ],
  };
}

async function postPayPalOrder(
  body: Record<string, unknown>,
  requestId: string,
) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": requestId.slice(0, 108),
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as
    | {
        id?: string;
        links?: Array<{ rel?: string; href?: string }>;
        message?: string;
        debug_id?: string;
        details?: Array<{
          description?: string;
          issue?: string;
          field?: string;
        }>;
      }
    | null;

  if (!response.ok || !data?.id) {
    const detail = data?.details?.[0];
    const message =
      detail?.description ||
      data?.message ||
      `PayPal order creation failed with status ${response.status}.`;

    console.error("PayPal order creation failed", {
      environment: PAYPAL_ENV,
      status: response.status,
      debugId: data?.debug_id,
      detail,
    });

    throw new PayPalApiError(
      `${message}${data?.debug_id ? ` PayPal debug ID: ${data.debug_id}.` : ""}`,
      response.status || 502,
      data?.debug_id,
    );
  }

  return data;
}

type CreatePayPalOrderInput = OrderItemInput & {
  returnUrl: string;
  cancelUrl: string;
};

/**
 * Redirect-based PayPal checkout retained for the existing kids booking flow.
 */
export async function createPayPalOrder(input: CreatePayPalOrderInput) {
  validateOrderInput(input);

  if (!input.returnUrl || !input.cancelUrl) {
    throw new PayPalConfigurationError(
      "PayPal checkout requires a return URL and cancellation URL.",
    );
  }

  const data = await postPayPalOrder(
    {
      intent: "CAPTURE",
      purchase_units: [buildPurchaseUnit(input)],
      application_context: {
        brand_name:
          process.env.PAYPAL_BRAND_NAME?.trim() || "Imaginelabs by Bodilum",
        user_action: "PAY_NOW",
        return_url: input.returnUrl,
        cancel_url: input.cancelUrl,
      },
    },
    input.reference,
  );

  const approveUrl = data.links?.find((link) => link.rel === "approve")?.href;

  if (!approveUrl) {
    throw new PayPalApiError(
      "PayPal did not return the hosted-checkout approval URL.",
      502,
    );
  }

  return { orderId: data.id as string, approveUrl };
}

/**
 * Creates a server-side order for PayPal Standard Checkout Buttons.
 * The PayPal JavaScript SDK opens the PayPal-owned checkout experience after
 * the customer selects the PayPal button. No card fields are rendered by the
 * Imaginelabs application.
 */
export async function createStandardPayPalButtonOrder(input: OrderItemInput) {
  validateOrderInput(input);

  const data = await postPayPalOrder(
    {
      intent: "CAPTURE",
      purchase_units: [buildPurchaseUnit(input)],
      payment_source: {
        paypal: buildPayPalWallet(input),
      },
    },
    `standard-${input.reference}`,
  );

  return { orderId: data.id as string };
}

type CapturedPayPalOrder = {
  id?: string;
  status?: string;
  purchase_units?: Array<{
    reference_id?: string;
    custom_id?: string;
    invoice_id?: string;
    payments?: {
      captures?: Array<{
        id?: string;
        status?: string;
        amount?: { currency_code?: string; value?: string };
      }>;
    };
  }>;
  payer?: {
    email_address?: string;
    name?: { given_name?: string; surname?: string };
  };
};

async function getPayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(
    `${PAYPAL_API}/v2/checkout/orders/${encodeURIComponent(orderId)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const error = await readPayPalError(response);
    throw new PayPalApiError(error.message, response.status, error.debugId);
  }

  return (await response.json()) as CapturedPayPalOrder;
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(
    `${PAYPAL_API}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `capture-${orderId}`.slice(0, 38),
        Prefer: "return=representation",
      },
      cache: "no-store",
    },
  );

  let data: CapturedPayPalOrder;

  if (!response.ok) {
    const error = await readPayPalError(response);

    if (error.detail?.issue === "ORDER_ALREADY_CAPTURED") {
      data = await getPayPalOrder(orderId);
    } else {
      console.error("PayPal order capture failed", {
        environment: PAYPAL_ENV,
        orderId,
        status: response.status,
        debugId: error.debugId,
        detail: error.detail,
      });
      throw new PayPalApiError(
        `${error.message}${error.debugId ? ` PayPal debug ID: ${error.debugId}.` : ""}`,
        response.status,
        error.debugId,
      );
    }
  } else {
    data = (await response.json()) as CapturedPayPalOrder;
  }

  if (data.status !== "COMPLETED") {
    throw new PayPalApiError("The PayPal order was not completed.", 409);
  }

  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  if (!capture || capture.status !== "COMPLETED") {
    throw new PayPalApiError("PayPal did not return a completed capture.", 409);
  }

  return data;
}
