export interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  SITE_URL: string;
  ALLOWED_ORIGIN: string;
  GOOGLE_REGISTRATION_WEBHOOK_URL?: string;
  GOOGLE_REGISTRATION_SHARED_SECRET?: string;
}

const WORKSHOPS: Record<string, { title: string; amount: number; currency: 'czk'; description: string }> = {
  'umeni-potesit-zenu': { title: 'Umění potěšit ženu', amount: 290000, currency: 'czk', description: 'Workshop pro muže' },
  'umeni-potesit-muze': { title: 'Umění potěšit muže', amount: 290000, currency: 'czk', description: 'Workshop pro ženy' },
  'jen-pro-pary': { title: 'Umění potěšit (pro páry)', amount: 290000, currency: 'czk', description: 'Cena za osobu' },
  'tajemstvi-panevniho-dna': { title: 'Tajemství pánevního dna', amount: 290000, currency: 'czk', description: 'Workshop pro ženy' },
  'byla-jsem-tehotna-ale': { title: 'Byla jsem těhotná, ale…', amount: 280000, currency: 'czk', description: 'Podpůrný workshop' },
  'porod-jako-jistota': { title: 'Porod jako jistota', amount: 420000, currency: 'czk', description: 'Cena včetně partnera' },
  'matka-a-dcera': { title: 'Matka a dcera', amount: 680000, currency: 'czk', description: 'Cena za dvojici' },
  'Hraj-si-se-mnou': { title: 'Hraj si se mnou', amount: 480000, currency: 'czk', description: 'Včetně ubytování a stravy' }
};

function json(data: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    }
  });
}

async function verifyStripeSignature(payload: string, signatureHeader: string, secret: string): Promise<boolean> {
  const parts = signatureHeader.split(',').map((part) => part.split('='));
  const timestamp = parts.find(([key]) => key === 't')?.[1];
  const signatures = parts.filter(([key]) => key === 'v1').map(([, value]) => value);
  if (!timestamp || signatures.length === 0) return false;
  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber) || Math.abs(Date.now() / 1000 - timestampNumber) > 300) return false;

  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expected = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return signatures.some((signature) => {
    if (signature.length !== expected.length) return false;
    let mismatch = 0;
    for (let i = 0; i < signature.length; i++) mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
    return mismatch === 0;
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = env.ALLOWED_ORIGIN;
    // Permit the local Vite preview for testing without changing the production site URL.
    const isLocalPreviewOrigin = origin === 'http://localhost:3000';
    const requestOriginAllowed = origin === allowedOrigin || isLocalPreviewOrigin;
    const corsOrigin = requestOriginAllowed ? origin : allowedOrigin;

    if (request.method === 'OPTIONS') {
      if (!requestOriginAllowed) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
          'Access-Control-Max-Age': '86400',
          'Vary': 'Origin'
        }
      });
    }

    if (url.pathname === '/api/webhook') {
      if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
      const rawBody = await request.text();
      const signature = request.headers.get('Stripe-Signature') || '';
      if (!env.STRIPE_WEBHOOK_SECRET || !(await verifyStripeSignature(rawBody, signature, env.STRIPE_WEBHOOK_SECRET))) {
        return new Response('Invalid Stripe signature', { status: 400 });
      }

      const event = JSON.parse(rawBody) as { id?: string; type?: string; data?: { object?: Record<string, unknown> } };
      const object = event.data?.object || {};
      if (event.type === 'checkout.session.completed' && object.payment_status === 'paid') {
        if (!env.GOOGLE_REGISTRATION_WEBHOOK_URL || !env.GOOGLE_REGISTRATION_SHARED_SECRET) {
          // Fail visibly so Stripe retries until the registration destination is configured.
          return new Response('Payment verified, but registration destination is not configured', { status: 500 });
        }
        const forward = await fetch(env.GOOGLE_REGISTRATION_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.GOOGLE_REGISTRATION_SHARED_SECRET}`
          },
          body: JSON.stringify({
            type: 'workshop_registration_paid',
            stripe_event_id: event.id,
            checkout_session_id: object.id,
            payment_intent_id: object.payment_intent,
            payment_status: object.payment_status,
            shared_secret: env.GOOGLE_REGISTRATION_SHARED_SECRET,
            amount_total: object.amount_total,
            currency: object.currency,
            customer_email: object.customer_details && (object.customer_details as Record<string, unknown>).email,
            customer_name: object.customer_details && (object.customer_details as Record<string, unknown>).name,
            metadata: object.metadata,
            paid_at: new Date().toISOString()
          })
        });
        const forwardedResult = await forward.json().catch(() => null) as { ok?: boolean } | null;
        if (!forward.ok || forwardedResult?.ok !== true) {
          return new Response('Registration destination failed', { status: 502 });
        }
      }
      return new Response('ok', { status: 200 });
    }

    if (url.pathname !== '/api/create-checkout-session' || request.method !== 'POST') {
      return new Response('Not found', { status: 404 });
    }
    if (!requestOriginAllowed) return json({ error: 'Origin is not allowed.' }, 403, allowedOrigin);
    if (!env.STRIPE_SECRET_KEY || !env.SITE_URL) {
      return json({ error: 'Platby zatím nejsou nakonfigurovány. Prosím kontaktujte Danielu.' }, 503, allowedOrigin);
    }

    let body: { workshopId?: string; participantName?: string; participantEmail?: string; successUrl?: string; cancelUrl?: string };
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Neplatný požadavek.' }, 400, allowedOrigin);
    }

    const workshop = body.workshopId ? WORKSHOPS[body.workshopId] : undefined;
    const name = (body.participantName || '').trim().slice(0, 120);
    const email = (body.participantEmail || '').trim().slice(0, 254);
    if (!workshop || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Zkontrolujte prosím workshop a své kontaktní údaje.' }, 400, allowedOrigin);
    }

    const site = new URL(env.SITE_URL);
    const successUrl = new URL('/', site);
    successUrl.search = '?payment=success&session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = new URL('/', site);
    cancelUrl.hash = `workshop-${encodeURIComponent(body.workshopId!)}`;

    const form = new URLSearchParams();
    form.set('mode', 'payment');
    form.set('success_url', successUrl.toString());
    form.set('cancel_url', cancelUrl.toString());
    form.set('customer_email', email);
    form.set('client_reference_id', body.workshopId!);
    form.set('line_items[0][price_data][currency]', workshop.currency);
    form.set('line_items[0][price_data][unit_amount]', String(workshop.amount));
    form.set('line_items[0][price_data][product_data][name]', workshop.title);
    form.set('line_items[0][price_data][product_data][description]', workshop.description);
    form.set('line_items[0][quantity]', '1');
    form.set('metadata[workshop_id]', body.workshopId!);
    form.set('metadata[workshop_title]', workshop.title);
    form.set('metadata[participant_name]', name);
    form.set('metadata[participant_email]', email);
    form.set('metadata[site_language]', 'cs');

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: form.toString()
    });
    const stripeData = await stripeResponse.json() as { url?: string; error?: { message?: string } };
    if (!stripeResponse.ok || !stripeData.url) {
      return json({ error: 'Stripe se nepodařilo připravit. Zkuste to později.' }, 502, allowedOrigin);
    }
    return json({ url: stripeData.url }, 200, corsOrigin);
  }
};
