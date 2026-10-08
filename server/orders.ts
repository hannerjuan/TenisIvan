import type { OrderTotals } from '../src/utils/pricing';
import type { PricedLine } from './order';

export type OrderStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';

export interface Order {
  reference: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  lines: PricedLine[];
  totals: OrderTotals;
  couponCode?: string;
  transactionId?: string;
  paymentMethod?: string;
}

/** Minimal key-value contract, satisfied by a Netlify Blobs store (and an in-memory map in tests) */
export interface OrderStore {
  setJSON(key: string, value: unknown): Promise<unknown>;
  get(key: string, options: { type: 'json' }): Promise<unknown>;
  list(): Promise<{ blobs: { key: string }[] }>;
}

export const saveOrder = (store: OrderStore, order: Order) => store.setJSON(order.reference, order);

export const getOrder = async (store: OrderStore, reference: string) =>
  ((await store.get(reference, { type: 'json' })) as Order | null) ?? null;

export const listOrders = async (store: OrderStore) => {
  const { blobs } = await store.list();
  const orders = await Promise.all(blobs.map((b) => getOrder(store, b.key)));
  return orders
    .filter((o): o is Order => o !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

const KNOWN_STATUSES: OrderStatus[] = ['APPROVED', 'DECLINED', 'VOIDED', 'ERROR', 'PENDING'];

/**
 * Applies a Wompi transaction to its order. The amount is checked against what the server
 * priced, so a transaction for a different amount can never mark an order as paid.
 */
export const applyTransaction = async (
  store: OrderStore,
  transaction: { id?: string; reference?: string; status?: string; amount_in_cents?: number; payment_method_type?: string }
): Promise<Order | null> => {
  if (!transaction.reference) return null;
  const order = await getOrder(store, transaction.reference);
  if (!order) return null;

  const status = KNOWN_STATUSES.includes(transaction.status as OrderStatus) ? (transaction.status as OrderStatus) : 'ERROR';
  const amountMatches = transaction.amount_in_cents === order.totals.total * 100;

  const updated: Order = {
    ...order,
    status: status === 'APPROVED' && !amountMatches ? 'ERROR' : status,
    transactionId: transaction.id ?? order.transactionId,
    paymentMethod: transaction.payment_method_type ?? order.paymentMethod,
    updatedAt: new Date().toISOString()
  };
  await saveOrder(store, updated);
  return updated;
};
