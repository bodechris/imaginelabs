import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";

export default function AiSprintPaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: 32,
            background: "#fffdf2",
            fontFamily: "var(--il-body, Arial, sans-serif)",
          }}
        >
          <p>Loading secure payment confirmation...</p>
        </main>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
