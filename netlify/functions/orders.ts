import { timingSafeEqual } from 'node:crypto';
import { listOrders } from '../../server/orders';
import { ordersStore } from '../../server/store';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const isAuthorized = (req: Request) => {
  const expected = process.env.ADMIN_TOKEN;
  const given = req.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
  if (!expected || expected.length < 12) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
};

/** Private list of orders for the store owner (password = ADMIN_TOKEN) */
export default async (req: Request) => {
  if (!isAuthorized(req)) return json({ error: 'Contraseña incorrecta.' }, 401);
  return json({ orders: await listOrders(ordersStore()) });
};

export const config = { path: '/api/orders' };
