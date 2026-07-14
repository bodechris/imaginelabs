# Integration notes for the existing imaginelabs app

The original `app.zip` archive was not available in the active workspace, so this package is a complete Phase 5 implementation that can also be used as an overlay for the current project.

The important integration points are:

1. Add `sendGTMEvent` to the current AI Business Sprint client page.
2. Push `generate_lead` only after `/api/ai-business-sprint/register` returns success.
3. Replace the PayPal.me link with server-created PayPal Checkout orders.
4. Push `begin_checkout` only after `/api/paypal/create-order` returns a valid order ID.
5. Capture and verify the order in `/api/paypal/capture-order`.
6. Push `purchase` only after that endpoint confirms `COMPLETED`, `ZAR`, and `950.00`.
7. Use the PayPal capture ID as `transaction_id`.
8. Keep the `sessionStorage` transaction guard. The purchase event is also located inside PayPal's `onApprove` callback, so a normal page refresh does not replay it.
9. Add `NEXT_PUBLIC_GTM_ID` and PayPal credentials from `.env.example`.
10. Configure the GTM triggers, variables, GA4 tags, Meta tags and GA4 key events described in `gtm-phase-5.md`.

The PayPal order amount is fixed on the server. The browser never sends a trusted price to PayPal, which prevents a customer from changing the workshop amount in client-side code.
