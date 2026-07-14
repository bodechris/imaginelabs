# imaginelabs AI Business Sprint - Phase 5

This package adds reliable registration and PayPal conversion tracking for Google Tag Manager, GA4 and Meta Pixel.

## Included

- GTM installed through `@next/third-parties/google`
- `generate_lead` after confirmed registration
- `begin_checkout` after PayPal creates a valid order
- backend-created PayPal order fixed at ZAR 950
- backend capture and amount/currency verification
- `purchase` with PayPal capture ID, currency, value and item data
- duplicate purchase protection for refresh/re-render scenarios
- existing Resend and optional Listmonk registration integrations
- GTM setup guide for GA4 and Meta

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add the GTM container ID.
3. Add PayPal sandbox credentials first.
4. Install dependencies with `npm install`.
5. Run `npm run dev`.
6. Configure GTM using `docs/gtm-phase-5.md`.
7. Test registration and payment in GTM Preview and PayPal Sandbox.
8. Change `PAYPAL_ENV=live` and use live PayPal credentials only after sandbox tests pass.

## Important files

- `app/ai-business-sprint/page.tsx` - registration success event
- `components/PayPalCheckout.tsx` - begin checkout and purchase events
- `app/api/paypal/create-order/route.ts` - trusted server-side order creation
- `app/api/paypal/capture-order/route.ts` - capture and payment verification
- `app/layout.tsx` - GTM container installation
- `docs/gtm-phase-5.md` - manual GTM configuration

Run `npm run verify:tracking` to check that the required event names and purchase parameters are present.
