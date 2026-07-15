const PROGRAM = "ai_business_sprint";
const ITEM_ID = "ai-business-sprint";
const ITEM_NAME = "AI Business Sprint";
const DISPLAY_PRICE_ZAR = 950;

type DataLayerValue = unknown;
type DataLayerPayload = Record<string, DataLayerValue>;

type TrackingWindow = Window & {
  dataLayer?: DataLayerPayload[];
};

type PaymentMethod = "paypal" | "bank";

type LeadEventInput = {
  reference: string;
  paymentMethod: PaymentMethod;
};

type CheckoutEventInput = {
  orderId: string;
  reference: string;
  currency: string;
  value: number;
};

type PurchaseEventInput = {
  transactionId: string;
  orderId: string;
  reference: string;
  currency: string;
  value: number;
};

function dataLayer() {
  if (typeof window === "undefined") return null;
  const trackingWindow = window as TrackingWindow;
  trackingWindow.dataLayer = trackingWindow.dataLayer || [];
  return trackingWindow.dataLayer;
}

function normaliseId(value: string) {
  return value
    .trim()
    .replace(/[^A-Za-z0-9_-]/g, "_")
    .slice(0, 120);
}

function storageKey(eventName: string, uniqueId: string) {
  return `imaginelabs_tracking:${eventName}:${normaliseId(uniqueId)}`;
}

function wasTracked(eventName: string, uniqueId: string) {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(storageKey(eventName, uniqueId)) === "1";
  } catch {
    return false;
  }
}

function markTracked(eventName: string, uniqueId: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(storageKey(eventName, uniqueId), "1");
  } catch {
    // Tracking must never block registration or payment when storage is disabled.
  }
}

function push(payload: DataLayerPayload) {
  const layer = dataLayer();
  if (!layer) return false;
  layer.push(payload);
  return true;
}

function ecommerceItem(value: number) {
  return {
    item_id: ITEM_ID,
    item_name: ITEM_NAME,
    affiliation: "imaginelabs",
    price: value,
    quantity: 1,
  };
}

export function trackGenerateLead({
  reference,
  paymentMethod,
}: LeadEventInput) {
  if (!reference || wasTracked("generate_lead", reference)) return;

  const eventId = `lead_${normaliseId(reference)}`;
  const pushed = push({
    event: "generate_lead",
    event_id: eventId,
    program: PROGRAM,
    lead_source: "website_registration",
    payment_method: paymentMethod,
    reference,
    currency: "ZAR",
    value: DISPLAY_PRICE_ZAR,
  });

  if (pushed) markTracked("generate_lead", reference);
}

export function trackBeginCheckout({
  orderId,
  reference,
  currency,
  value,
}: CheckoutEventInput) {
  if (!orderId || !Number.isFinite(value) || value <= 0) return;
  if (wasTracked("begin_checkout", orderId)) return;

  const eventId = `checkout_${normaliseId(orderId)}`;
  const layer = dataLayer();
  if (!layer) return;

  // Clear any previous ecommerce object before sending a new GA4 ecommerce event.
  layer.push({ ecommerce: null });
  layer.push({
    event: "begin_checkout",
    event_id: eventId,
    program: PROGRAM,
    payment_method: "paypal",
    transaction_id: orderId,
    order_id: orderId,
    reference,
    currency,
    value,
    price_zar: DISPLAY_PRICE_ZAR,
    ecommerce: {
      currency,
      value,
      items: [ecommerceItem(value)],
    },
  });

  markTracked("begin_checkout", orderId);
}

export async function trackPurchase({
  transactionId,
  orderId,
  reference,
  currency,
  value,
}: PurchaseEventInput) {
  if (!transactionId || !Number.isFinite(value) || value <= 0) return;
  if (wasTracked("purchase", transactionId)) return;

  const layer = dataLayer();
  if (!layer) return;

  const eventId = `purchase_${normaliseId(transactionId)}`;
  markTracked("purchase", transactionId);

  await new Promise<void>((resolve) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      resolve();
    };

    layer.push({ ecommerce: null });
    layer.push({
      event: "purchase",
      event_id: eventId,
      program: PROGRAM,
      transaction_id: transactionId,
      order_id: orderId,
      reference,
      currency,
      value,
      price_zar: DISPLAY_PRICE_ZAR,
      ecommerce: {
        transaction_id: transactionId,
        affiliation: "imaginelabs",
        currency,
        value,
        items: [ecommerceItem(value)],
      },
      // Google Tag Manager calls this after all matching tags complete.
      eventCallback: finish,
      eventTimeout: 1500,
    });

    window.setTimeout(finish, 1600);
  });
}

export const aiSprintTrackingConfig = {
  program: PROGRAM,
  itemId: ITEM_ID,
  itemName: ITEM_NAME,
  displayPriceZar: DISPLAY_PRICE_ZAR,
};
