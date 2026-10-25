# Daniela Torp Stripe Checkout Worker

This is a separate Cloudflare Worker for creating Stripe Checkout Sessions. It does not replace the existing React website or its current Google Apps Script contact form.

## Required configuration

Set these Worker secrets in Cloudflare (never in frontend code or GitHub):

- `STRIPE_SECRET_KEY`: Stripe test secret key during testing; use the live key only after acceptance testing.
- `STRIPE_WEBHOOK_SECRET`: signing secret for the Stripe webhook configured to call `/api/webhook`.

Set these non-secret Worker variables in `wrangler.toml` or Cloudflare settings:

- `SITE_URL`: canonical public site URL.
- `ALLOWED_ORIGIN`: exact origin permitted to call the checkout endpoint.

The frontend needs `VITE_STRIPE_WORKER_URL` set to the deployed Worker base URL when building the website.

## Stripe setup

1. Deploy this Worker with Cloudflare Wrangler or the Cloudflare dashboard.
2. Add the two secrets securely using Cloudflare's secret settings.
3. In Stripe **test mode**, create a webhook pointing to `https://YOUR-WORKER/api/webhook`, listening for `checkout.session.completed`. Store the endpoint signing secret as `STRIPE_WEBHOOK_SECRET`.
4. Do not enable live payments yet. Test successful, cancelled, declined, and duplicate webhook delivery.

## Registration records (required before launch)

For paid `checkout.session.completed` events, the Worker verifies Stripe's signature and forwards the verified event to `GOOGLE_REGISTRATION_WEBHOOK_URL`. This must be a **new, dedicated Google Apps Script web app** that validates and records registration events in the intended Google Sheet, with duplicate-event protection using Stripe event ID. Do not point it at the existing contact form endpoint; that endpoint accepts a different payload and must remain untouched.

Set `GOOGLE_REGISTRATION_WEBHOOK_URL` as a Worker variable only after that dedicated endpoint has been implemented and tested. Until it is configured, the Worker intentionally returns an error for paid checkout events so Stripe retries delivery. No payment is considered registered by the website solely because the browser returns from Checkout.

## Pricing safety

Workshop prices are server-side allowlisted in `src/index.ts` in Czech haléře. The seasonal `Ženská esence a životní síla` cycle is deliberately not enabled for checkout because a participant must select a specific seasonal session first. Confirm every listed price and the intended dates with the client before live mode.

## Free tier note

Cloudflare Workers has a free allowance, but provider limits and account eligibility can change. Check current Cloudflare terms and usage in the account before deployment. Stripe processing fees still apply to real payments.
