import { readFile } from "node:fs/promises";
import process from "node:process";

const files = {
  page: new URL("../app/ai-business-sprint/page.tsx", import.meta.url),
  paypal: new URL("../components/PayPalCheckout.tsx", import.meta.url),
  capture: new URL("../app/api/paypal/capture-order/route.ts", import.meta.url),
};

const [page, paypal, capture] = await Promise.all([
  readFile(files.page, "utf8"),
  readFile(files.paypal, "utf8"),
  readFile(files.capture, "utf8"),
]);

const checks = [
  [page.includes('event: "generate_lead"'), "generate_lead event"],
  [page.includes('lead_source: "website_registration"'), "lead source"],
  [paypal.includes('event: "begin_checkout"'), "begin_checkout event"],
  [paypal.includes('event: "purchase"'), "purchase event"],
  [paypal.includes("transaction_id: transactionId"), "transaction ID"],
  [paypal.includes('currency: "ZAR"'), "ZAR currency"],
  [paypal.includes("value: SPRINT_PRICE"), "purchase value"],
  [paypal.includes('item_id: "ai-business-sprint"'), "purchase item"],
  [paypal.includes("sessionStorage.getItem"), "duplicate browser guard"],
  [capture.includes("verifySprintCapture"), "backend capture verification"],
  [capture.includes('"PayPal-Request-Id"'), "idempotent capture request"],
];

const failures = checks.filter(([passed]) => !passed);

for (const [passed, label] of checks) {
  console.log(`${passed ? "PASS" : "FAIL"} ${label}`);
}

if (failures.length) {
  process.exitCode = 1;
} else {
  console.log("\nAll Phase 5 tracking checks passed.");
}
