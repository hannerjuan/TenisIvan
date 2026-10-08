import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export interface WompiConfig {
  publicKey: string;
  integritySecret: string;
  eventsSecret: string;
  apiBase: string;
}

/** Reads the Wompi keys; sandbox or production is inferred from the public key prefix */
export const getWompiConfig = (env: Record<string, string | undefined> = process.env): WompiConfig | null => {
  const publicKey = env.WOMPI_PUBLIC_KEY;
  const integritySecret = env.WOMPI_INTEGRITY_SECRET;
  const eventsSecret = env.WOMPI_EVENTS_SECRET ?? '';
  if (!publicKey || !integritySecret) return null;
  const apiBase = publicKey.startsWith('pub_test_') ? 'https://sandbox.wompi.co/v1' : 'https://production.wompi.co/v1';
  return { publicKey, integritySecret, eventsSecret, apiBase };
};

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

export const createOrderReference = () => `TIVAN-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`;

/** Integrity signature Wompi requires so the amount cannot be tampered with in the browser */
export const integritySignature = (reference: string, amountInCents: number, currency: string, integritySecret: string) =>
  sha256(`${reference}${amountInCents}${currency}${integritySecret}`);

export const buildCheckoutUrl = (params: {
  config: WompiConfig;
  reference: string;
  amountInCents: number;
  redirectUrl: string;
  customer: { email: string; fullName: string };
}) => {
  const { config, reference, amountInCents, redirectUrl, customer } = params;
  const url = new URL('https://checkout.wompi.co/p/');
  url.searchParams.set('public-key', config.publicKey);
  url.searchParams.set('currency', 'COP');
  url.searchParams.set('amount-in-cents', String(amountInCents));
  url.searchParams.set('reference', reference);
  url.searchParams.set('signature:integrity', integritySignature(reference, amountInCents, 'COP', config.integritySecret));
  url.searchParams.set('redirect-url', redirectUrl);
  url.searchParams.set('customer-data:email', customer.email);
  url.searchParams.set('customer-data:full-name', customer.fullName);
  return url.toString();
};

export interface WompiEvent {
  event: string;
  data: Record<string, unknown>;
  signature?: { properties?: string[]; checksum?: string };
  timestamp?: number;
}

const readPath = (data: Record<string, unknown>, path: string): unknown =>
  path.split('.').reduce<unknown>((value, key) => (value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined), data);

/** Verifies the checksum Wompi attaches to every event sent to the webhook */
export const verifyEventChecksum = (event: WompiEvent, eventsSecret: string) => {
  const { properties, checksum } = event.signature ?? {};
  if (!eventsSecret || !properties?.length || !checksum || event.timestamp === undefined) return false;
  const concatenated = properties.map((p) => String(readPath(event.data, p) ?? '')).join('');
  const expected = sha256(`${concatenated}${event.timestamp}${eventsSecret}`);
  const a = Buffer.from(expected);
  const b = Buffer.from(checksum.toLowerCase());
  return a.length === b.length && timingSafeEqual(a, b);
};
