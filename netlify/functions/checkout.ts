import { priceOrder, OrderError } from '../../server/order';
import { buildCheckoutUrl, createOrderReference, getWompiConfig } from '../../server/wompi';
import { saveOrder } from '../../server/orders';
import { readCatalog } from '../../server/catalog';
import { catalogStore, ordersStore } from '../../server/store';
import { json } from '../../server/auth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Prices the bag on the server, stores the order and returns a signed Wompi checkout URL */
export default async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  const config = getWompiConfig();
  if (!config) return json({ error: 'Los pagos no están configurados.' }, 503);

  let body: { items?: unknown; couponCode?: unknown; customer?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Solicitud no válida.' }, 400);
  }

  const field = (name: string) => String(body.customer?.[name] ?? '').trim().slice(0, 200);
  const customer = {
    fullName: field('fullName'),
    email: field('email'),
    phone: field('phone'),
    address: field('address'),
    city: field('city'),
    postalCode: field('postalCode')
  };
  if (!EMAIL_RE.test(customer.email) || Object.values(customer).some((v) => !v)) {
    return json({ error: 'Revisa tus datos de envío.' }, 400);
  }

  try {
    const { lines, totals } = priceOrder(await readCatalog(catalogStore()), body.items, body.couponCode);
    const reference = createOrderReference();
    const now = new Date().toISOString();
    await saveOrder(ordersStore(), {
      reference,
      createdAt: now,
      updatedAt: now,
      status: 'PENDING',
      customer,
      lines,
      totals,
      couponCode: typeof body.couponCode === 'string' && totals.discountAmount > 0 ? body.couponCode.toUpperCase() : undefined
    });
    const origin = process.env.URL ?? new URL(req.url).origin;
    const checkoutUrl = buildCheckoutUrl({
      config,
      reference,
      amountInCents: totals.total * 100,
      redirectUrl: `${origin}/`,
      customer: { email: customer.email, fullName: customer.fullName }
    });
    return json({ checkoutUrl, reference, total: totals.total });
  } catch (error) {
    if (error instanceof OrderError) return json({ error: error.message }, 422);
    console.error('checkout failed', error);
    return json({ error: 'No pudimos iniciar el pago. Inténtalo de nuevo.' }, 500);
  }
};

export const config = { path: '/api/checkout' };
