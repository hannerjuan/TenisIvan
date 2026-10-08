import { getWompiConfig, verifyEventChecksum, WompiEvent } from '../../server/wompi';
import { applyTransaction, WompiTransaction } from '../../server/orders';
import { catalogStore, ordersStore } from '../../server/store';

/**
 * Webhook Wompi calls when a transaction changes state. This is the source of truth for
 * whether an order was paid: configure its URL (https://<tu-sitio>/api/wompi-events) in
 * the Wompi dashboard. It updates the stored order with the payment result.
 */
export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const config = getWompiConfig();
  if (!config?.eventsSecret) return new Response('Not configured', { status: 503 });

  let event: WompiEvent;
  try {
    event = await req.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  if (!verifyEventChecksum(event, config.eventsSecret)) {
    return new Response('Invalid signature', { status: 401 });
  }

  if (event.event === 'transaction.updated' && event.data.transaction) {
    const order = await applyTransaction({ orders: ordersStore(), catalog: catalogStore() }, event.data.transaction as WompiTransaction);
    console.log('wompi event', order?.reference ?? 'unknown order', order?.status);
  }
  return new Response('ok', { status: 200 });
};

export const config = { path: '/api/wompi-events' };
