import type { Product } from '../types';
import { SNEAKER_STYLES } from '../data/catalog';

export const LOW_STOCK_THRESHOLD = 3;

export const unitsFor = (product: Product, colorId: string, size: string) =>
  Math.max(0, Math.floor(product.stock[colorId]?.[size] ?? 0));

/** A size is available for a colour, or for any colour when none is given */
export const isSizeAvailable = (product: Product, size: string, colorId?: string) =>
  colorId ? unitsFor(product, colorId, size) > 0 : product.colors.some((c) => unitsFor(product, c.id, size) > 0);

export const totalUnits = (product: Product) =>
  product.colors.reduce((acc, c) => acc + product.sizes.reduce((sum, size) => sum + unitsFor(product, c.id, size), 0), 0);

export const isInStock = (product: Product) => totalUnits(product) > 0;

export const mainImage = (product: Product) => product.colors.find((c) => c.images.length)?.images[0] ?? '';

export const styleName = (slug: string) => SNEAKER_STYLES.find((s) => s.slug === slug)?.name ?? slug;
