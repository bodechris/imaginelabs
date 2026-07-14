"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import {
  PayPalButtons,
  PayPalScriptProvider,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { useState } from "react";

const SPRINT_PRICE = 950;
const PURCHASE_STORAGE_PREFIX = "imaginelabs_purchase_";

type PayPalCheckoutProps = {
  reference: string;
  email: string;
  onSuccess?: (transactionId: string) => void;
};

type CreateOrderResponse = {
  orderId?: string;
  message?: string;
};

type CaptureOrderResponse = {
  verified?: boolean;
  transactionId?: string;
  message?: string;
};

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "PayPal checkout could not be completed.";
}

export default function PayPalCheckout({
  reference,
  email,
  onSuccess,
}: PayPalCheckoutProps) {
  const [checkoutError, setCheckoutError] = useState("");
  const [processing, setProcessing] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <p className="paymentError" role="alert">
        PayPal is not configured yet. Add NEXT_PUBLIC_PAYPAL_CLIENT_ID.
      </p>
    );
  }

  const paypalOptions: ReactPayPalScriptOptions = {
    clientId,
    currency: "ZAR",
    intent: "capture",
    components: "buttons",
  };

  return (
    <div className="paypalCheckout" aria-busy={processing}>
      <PayPalScriptProvider options={paypalOptions}>
        <PayPalButtons
          style={{
            layout: "vertical",
            shape: "pill",
            label: "paypal",
            height: 48,
          }}
          disabled={processing}
          forceReRender={[reference, email]}
          createOrder={async () => {
            setCheckoutError("");

            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference, email }),
            });
            const data = (await response.json()) as CreateOrderResponse;

            if (!response.ok || !data.orderId) {
              throw new Error(data.message || "Unable to create the PayPal order.");
            }

            // This fires only after PayPal has returned a valid order ID.
            sendGTMEvent({
              event: "begin_checkout",
              program: "ai_business_sprint",
              currency: "ZAR",
              value: SPRINT_PRICE,
            });

            return data.orderId;
          }}
          onApprove={async ({ orderID }) => {
            setProcessing(true);
            setCheckoutError("");

            try {
              const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: orderID }),
              });
              const data = (await response.json()) as CaptureOrderResponse;

              if (!response.ok || !data.verified || !data.transactionId) {
                throw new Error(
                  data.message || "The PayPal payment could not be verified.",
                );
              }

              const transactionId = data.transactionId;
              const storageKey = `${PURCHASE_STORAGE_PREFIX}${transactionId}`;

              // onApprove does not run from a normal page refresh. The storage
              // guard also prevents duplicate purchase pushes in this browser tab/session.
              if (sessionStorage.getItem(storageKey) !== "sent") {
                sendGTMEvent({
                  event: "purchase",
                  transaction_id: transactionId,
                  currency: "ZAR",
                  value: SPRINT_PRICE,
                  items: [
                    {
                      item_id: "ai-business-sprint",
                      item_name: "AI Business Sprint",
                      price: SPRINT_PRICE,
                      quantity: 1,
                    },
                  ],
                });
                sessionStorage.setItem(storageKey, "sent");
              }

              onSuccess?.(transactionId);
            } catch (error) {
              setCheckoutError(errorMessage(error));
            } finally {
              setProcessing(false);
            }
          }}
          onCancel={() => {
            setProcessing(false);
            setCheckoutError(
              "Checkout was cancelled. Your registration is still saved.",
            );
          }}
          onError={(error) => {
            setProcessing(false);
            setCheckoutError(errorMessage(error));
          }}
        />
      </PayPalScriptProvider>

      {processing ? <p className="paymentStatus">Verifying payment...</p> : null}
      {checkoutError ? (
        <p className="paymentError" role="alert">
          {checkoutError}
        </p>
      ) : null}
    </div>
  );
}
