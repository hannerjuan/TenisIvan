import type { OrderTotals } from '../src/utils/pricing';
import type { PricedLine } from './order';
import { decrementStock, updateCatalog } from './catalog';
import { JsonStore, updateJSON } from './kv';

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
  /** Set once the sold pairs have been taken out of stock, so it never happens twice */
  stockDeducted?: boolean;
  /** Pairs that were paid for but were no longer in stock */
  stockIssue?: string;
}

export const saveOrder = (store: JsonStore, order: Order) => store.setJSON(order.reference, order);

export const getOrder = async (store: JsonStore, reference: string) =>
  ((await store.getWithMetadata(reference, { type: 'json' }))?.data as Order | undefined) ?? null;

export const listOrders = async (store: JsonStore) => {
  const { blobs } = await store.list();
  const orders = await Promise.all(blobs.map((b) => getOrder(store, b.key)));
  return orders
    .filter((o): o is Order => o !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

const KNOWN_STATUSES: OrderStatus[] = ['APPROVED', 'DECLINED', 'VOIDED', 'ERROR', 'PENDING'];

export interface WompiTransaction {
  id?: string;
  reference?: string;
  status?: string;
  amount_in_cents?: number;
  payment_method_type?: string;
}

/**
 * Applies a Wompi transaction to its order. The amount is checked against what the server
 * priced, so a transaction for a different amount can never mark an order as paid. The
 * first time an order becomes paid, its pairs are taken out of stock (exactly once, even
 * if the webhook and the customer's return arrive at the same time).
 */
export const applyTransaction = async (
  stores: { orders: JsonStore; catalog: JsonStore },
  transaction: WompiTransaction
): Promise<Order | null> => {
  if (!transaction.reference) return null;

  let deductStock = false;
  const updated = await updateJSON<Order>(stores.orders, transaction.reference, (order) => {
    if (!order) return null;
    const reported = KNOWN_STATUSES.includes(transaction.status as OrderStatus) ? (transaction.status as OrderStatus) : 'ERROR';
    const amountMatches = transaction.amount_in_cents === order.totals.total * 100;
    const checked = reported === 'APPROVED' && !amountMatches ? 'ERROR' : reported;
    // A paid order only changes again if the payment is voided; late "pending" events are ignored
    const status: OrderStatus = order.status === 'APPROVED' && checked !== 'VOIDED' ? 'APPROVED' : checked;
    deductStock = status === 'APPROVED' && !order.stockDeducted;
    return {
      ...order,
      status,
      stockDeducted: order.stockDeducted || status === 'APPROVED',
      transactionId: transaction.id ?? order.transactionId,
      paymentMethod: transaction.payment_method_type ?? order.paymentMethod,
      updatedAt: new Date().toISOString()
    };
  });
  if (!updated || !deductStock) return updated;

  let shortages: ReturnType<typeof decrementStock>['shortages'] = [];
  await updateCatalog(stores.catalog, (products) => {
    const result = decrementStock(products, updated.lines);
    shortages = result.shortages;
    return result.products;
  });
  if (!shortages.length) return updated;

  const stockIssue = shortages
    .map((s) => {
      const line = updated.lines.find((l) => l.productId === s.productId && l.colorId === s.colorId && l.size === s.size);
      return `${line?.title ?? s.productId} ${line?.colorName ?? ''} talla ${s.size}`.replace(/\s+/g, ' ');
    })
    .join(', ');
  return updateJSON<Order>(stores.orders, updated.reference, (order) => (order ? { ...order, stockIssue } : null));
};
