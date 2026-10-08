import { PRODUCTS_CATALOG } from '../src/data/catalog';
import { calculateTotals, OrderTotals } from '../src/utils/pricing';

export interface OrderLineInput {
  productId: string;
  size: string;
  colorName: string;
  quantity: number;
}

export class OrderError extends Error {}

const MAX_LINES = 20;
const MAX_QUANTITY = 10;

export interface PricedLine extends OrderLineInput {
  title: string;
  price: number;
}

/** Re-prices an order from the catalog; never trusts prices sent by the browser */
export const priceOrder = (lines: unknown, couponCode?: unknown): { lines: PricedLine[]; totals: OrderTotals } => {
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_LINES) {
    throw new OrderError('La bolsa está vacía o tiene demasiados productos.');
  }

  const priced = lines.map((raw) => {
    const line = raw as Partial<OrderLineInput>;
    const product = PRODUCTS_CATALOG.find((p) => p.id === line.productId);
    if (!product) throw new OrderError('Uno de los productos ya no está disponible.');
    if (!product.sizes.some((s) => s.size === line.size && s.available)) {
      throw new OrderError(`La talla ${line.size} de ${product.title} está agotada.`);
    }
    if (!product.colors.some((c) => c.name === line.colorName && c.inStock)) {
      throw new OrderError(`El color elegido de ${product.title} no está disponible.`);
    }
    const quantity = Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new OrderError('Cantidad no válida.');
    }
    return { productId: product.id, title: product.title, size: line.size!, colorName: line.colorName!, quantity, price: product.price };
  });

  return { lines: priced, totals: calculateTotals(priced, typeof couponCode === 'string' ? couponCode : undefined) };
};
