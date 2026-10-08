import { getWompiConfig } from '../../server/wompi';
import { json } from '../../server/auth';
import { applyTransaction } from '../../server/orders';
import { catalogStore, ordersStore } from '../../server/store';


/** Looks up a Wompi transaction after the customer is redirected back to the store */
export default async (req: Request) => {
  const config = getWompiConfig();
  if (!config) return json({ error: 'Los pagos no están configurados.' }, 503);

  const id = new URL(req.url).searchParams.get('id') ?? '';
  if (!/^[\w-]{1,64}$/.test(id)) return json({ error: 'Transacción no válida.' }, 400);

  const response = await fetch(`${config.apiBase}/transactions/${encodeURIComponent(id)}`);
  if (!response.ok) return json({ error: 'No encontramos el pago.' }, response.status === 404 ? 404 : 502);

  const { data } = (await response.json()) as {
    data: { id: string; status: string; reference: string; amount_in_cents: number; payment_method_type?: string };
  };
  // Fetched from Wompi by the server, so it is safe to record even if the webhook is late
  const order = await applyTransaction({ orders: ordersStore(), catalog: catalogStore() }, data);
  if (!order) return json({ error: 'No encontramos el pedido.' }, 404);

  return json({
    status: order.status,
    reference: data.reference,
    total: data.amount_in_cents / 100,
    paymentMethod: data.payment_method_type ?? null
  });
};

export const config = { path: '/api/order-status' };
