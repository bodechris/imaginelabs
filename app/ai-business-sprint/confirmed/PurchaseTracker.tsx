"use client";

import { useEffect } from "react";
import { trackPurchase } from "../../_lib/tracking";

type Props = {
  transactionId: string;
  orderId: string;
  reference: string;
  currency: string;
  value: number;
};

export default function PurchaseTracker({
  transactionId,
  orderId,
  reference,
  currency,
  value,
}: Props) {
  useEffect(() => {
    void trackPurchase({
      transactionId,
      orderId,
      reference,
      currency,
      value,
    });
  }, [currency, orderId, reference, transactionId, value]);

  return null;
}
