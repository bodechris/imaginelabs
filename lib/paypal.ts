const PAYPAL_SANDBOX_API = "https://api-m.sandbox.paypal.com";
const PAYPAL_LIVE_API = "https://api-m.paypal.com";

export const AI_SPRINT_PRICE = "950.00";
export const AI_SPRINT_CURRENCY = "ZAR";

function getPayPalApiBase() {
  return process.env.PAYPAL_ENV === "live"
    ? PAYPAL_LIVE_API
    : PAYPAL_SANDBOX_API;
}

function getCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal server credentials are not configured.");
  }

  return { clientId, clientSecret };
}

async function getAccessToken() {
  const { clientId, clientSecret } = getCredentials();
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${getPayPalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const data = (await response.json()) as {
    access_token?: string;
    error_description?: string;
  };

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || "Unable to authenticate with PayPal.");
  }

  return data.access_token;
}

export async function paypalRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ response: Response; data: T }> {
  const accessToken = await getAccessToken();
  const response = await fetch(`${getPayPalApiBase()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  const data = (await response.json()) as T;
  return { response, data };
}

export type PayPalCapture = {
  id?: string;
  status?: string;
  amount?: {
    currency_code?: string;
    value?: string;
  };
};

export type PayPalOrder = {
  id?: string;
  status?: string;
  purchase_units?: Array<{
    amount?: {
      currency_code?: string;
      value?: string;
    };
    payments?: {
      captures?: PayPalCapture[];
    };
  }>;
  message?: string;
  details?: Array<{ issue?: string; description?: string }>;
};

export function verifySprintCapture(order: PayPalOrder) {
  const unit = order.purchase_units?.[0];
  const capture = unit?.payments?.captures?.find(
    (item) => item.status === "COMPLETED",
  );

  const amount = capture?.amount || unit?.amount;
  const verified =
    order.status === "COMPLETED" &&
    amount?.currency_code === AI_SPRINT_CURRENCY &&
    amount?.value === AI_SPRINT_PRICE;

  return {
    verified,
    transactionId: capture?.id || order.id || "",
    amount,
  };
}
