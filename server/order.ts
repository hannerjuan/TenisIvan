import type { Product } from '../src/types';
import { calculateTotals, OrderTotals } from '../src/utils/pricing';
import { findStockShortages } from './catalog';

export interface OrderLineInput {
  productId: string;
  colorId: string;
  size: string;
  quantity: number;
}

export interface PricedLine extends OrderLineInput {
  title: string;
  colorName: string;
  price: number;
}

export class OrderError extends Error {}

const MAX_LINES = 20;
const MAX_QUANTITY = 10;

/**
 * Re-prices an order from the stored catalog and checks there is stock for every pair.
 * Prices sent by the browser are never trusted.
 */
export const priceOrder = (
  products: Product[],
  lines: unknown,
  couponCode?: unknown
): { lines: PricedLine[]; totals: OrderTotals } => {
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_LINES) {
    throw new OrderError('La bolsa está vacía o tiene demasiados productos.');
  }

  const priced = lines.map((raw): PricedLine => {
    const line = raw as Partial<OrderLineInput>;
    const product = products.find((p) => p.id === line.productId && p.published);
    if (!product) throw new OrderError('Uno de los productos ya no está disponible.');
    const color = product.colors.find((c) => c.id === line.colorId);
    if (!color) throw new OrderError(`El color elegido de ${product.title} ya no está disponible.`);
    if (!product.sizes.includes(String(line.size))) throw new OrderError(`${product.title} no viene en talla ${line.size}.`);
    const quantity = Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) throw new OrderError('Cantidad no válida.');
    return { productId: product.id, colorId: color.id, colorName: color.name, size: String(line.size), quantity, title: product.title, price: product.price };
  });

  const [shortage] = findStockShortages(products, priced);
  if (shortage) {
    const line = priced.find((l) => l.productId === shortage.productId && l.colorId === shortage.colorId && l.size === shortage.size)!;
    throw new OrderError(`No nos quedan suficientes ${line.title} ${line.colorName} en talla ${line.size}.`);
  }

  return { lines: priced, totals: calculateTotals(priced, typeof couponCode === 'string' ? couponCode : undefined) };
};
