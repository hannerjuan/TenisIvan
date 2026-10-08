import { listOrders } from '../../server/orders';
import { ordersStore } from '../../server/store';
import { isAdmin, json } from '../../server/auth';

/** Private list of orders for the store owner (password = ADMIN_TOKEN) */
export default async (req: Request) => {
  if (!isAdmin(req)) return json({ error: 'Contraseña incorrecta.' }, 401);
  return json({ orders: await listOrders(ordersStore()) });
};

export const config = { path: '/api/orders' };
