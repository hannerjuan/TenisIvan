import { randomBytes } from 'node:crypto';
import type { Department, Product, ProductColor, StockMatrix } from '../src/types';
import { DEPARTMENTS, GARMENT_TYPES, sizesFor } from '../src/data/catalog';
import { JsonStore, updateJSON } from './kv';

const CATALOG_KEY = 'products';

export class ValidationError extends Error {}

/**
 * Products saved before the switch to departments and garment types had a sneaker style in `category`,
 * a gender in `targetGender` and a few copy fields that no longer exist: they become Tenis for Mujer or Hombre.
 */
export const migrateProduct = (stored: Product): Product => {
  if (stored.department && stored.garment) return stored;
  const { category, targetGender, badge, cardColor, highlight, description, materials, fit, care, ...rest } = stored as Product &
    Record<'category' | 'targetGender' | 'badge' | 'cardColor' | 'highlight' | 'description' | 'materials' | 'fit' | 'care', unknown>;
  return { ...rest, department: targetGender === 'Mujer' ? 'mujer' : 'hombre', garment: 'tenis' };
};

const readStored = (data: unknown) => ((data as Product[] | undefined) ?? []).map(migrateProduct);

export const readCatalog = async (store: JsonStore): Promise<Product[]> => {
  const current = await store.getWithMetadata(CATALOG_KEY, { type: 'json' });
  return readStored(current?.data);
};

export const updateCatalog = (store: JsonStore, mutate: (products: Product[]) => Product[]) =>
  updateJSON<Product[]>(store, CATALOG_KEY, (current) => mutate(readStored(current))).then((p) => p ?? []);

// ---------- validation of products sent by the admin panel ----------

const HEX_RE = /^#[0-9a-f]{6}$/i;
const ID_RE = /^[a-z0-9-]{1,60}$/;
const IMAGE_RE = /^(https:\/\/|\/api\/images\/)[^\s"'<>]+$/;

const text = (value: unknown, field: string, { required = false, max = 600 } = {}) => {
  const v = typeof value === 'string' ? value.trim() : '';
  if (required && !v) throw new ValidationError(`Falta ${field}.`);
  if (v.length > max) throw new ValidationError(`${field} es demasiado largo.`);
  return v;
};

const pesos = (value: unknown, field: string) => {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0 || n > 50_000_000) throw new ValidationError(`${field} debe ser un valor en pesos sin decimales.`);
  return n;
};

const slugify = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'producto';

/** Turns whatever the admin panel sent into a clean Product, or explains what is wrong */
export const sanitizeProduct = (input: unknown): Product => {
  const raw = (input ?? {}) as Record<string, unknown>;
  const title = text(raw.title, 'el nombre', { required: true, max: 80 });

  const department = raw.department as Department;
  if (!DEPARTMENTS.some((d) => d.slug === department)) throw new ValidationError('Elige una categoría válida: Hombre, Mujer o Niño.');
  const garment = String(raw.garment ?? '');
  if (!GARMENT_TYPES.some((g) => g.slug === garment)) throw new ValidationError('Elige un tipo de prenda válido.');

  const price = pesos(raw.price, 'El precio');
  const originalPrice = raw.originalPrice === undefined || raw.originalPrice === null || raw.originalPrice === '' ? undefined : pesos(raw.originalPrice, 'El precio anterior');
  if (originalPrice !== undefined && originalPrice <= price) throw new ValidationError('El precio anterior debe ser mayor que el precio actual.');

  const sizes = Array.isArray(raw.sizes) ? sizesFor(department, garment).filter((s) => (raw.sizes as unknown[]).includes(s)) : [];
  if (!sizes.length) throw new ValidationError('Elige al menos una talla.');

  const rawColors = Array.isArray(raw.colors) ? raw.colors : [];
  if (!rawColors.length || rawColors.length > 8) throw new ValidationError('Agrega entre 1 y 8 colores.');
  const colors: ProductColor[] = rawColors.map((c, i) => {
    const color = (c ?? {}) as Record<string, unknown>;
    const name = text(color.name, `el nombre del color ${i + 1}`, { required: true, max: 40 });
    const colorHex = String(color.colorHex ?? '');
    if (!HEX_RE.test(colorHex)) throw new ValidationError(`El color "${name}" no tiene un tono válido.`);
    const images = (Array.isArray(color.images) ? color.images : []).map(String).filter((url) => IMAGE_RE.test(url)).slice(0, 8);
    const id = ID_RE.test(String(color.id ?? '')) ? String(color.id) : `${slugify(name)}-${i}`;
    return { id, name, colorHex, images };
  });
  if (new Set(colors.map((c) => c.id)).size !== colors.length) throw new ValidationError('Hay colores repetidos.');
  if (!colors.some((c) => c.images.length)) throw new ValidationError('Sube al menos una foto.');

  const rawStock = (raw.stock ?? {}) as Record<string, Record<string, unknown>>;
  const stock: StockMatrix = {};
  for (const color of colors) {
    stock[color.id] = {};
    for (const size of sizes) {
      const units = Number(rawStock[color.id]?.[size] ?? 0);
      if (!Number.isInteger(units) || units < 0 || units > 99_999) throw new ValidationError(`Revisa las unidades de ${color.name}, talla ${size}.`);
      stock[color.id][size] = units;
    }
  }


  return {
    id: ID_RE.test(String(raw.id ?? '')) ? String(raw.id) : `${slugify(title)}-${randomBytes(2).toString('hex')}`,
    title,
    subtitle: text(raw.subtitle, 'la descripción corta', { max: 140 }),
    department,
    garment,
    price,
    originalPrice,
    featured: raw.featured === true,
    colors,
    sizes,
    stock,
    published: raw.published === true,
    updatedAt: new Date().toISOString()
  };
};

// ---------- stock ----------

export interface StockLine {
  productId: string;
  colorId: string;
  size: string;
  quantity: number;
}

const stockKey = (l: StockLine) => `${l.productId}|${l.colorId}|${l.size}`;

/** Quantities grouped per product/colour/size, so two bag lines for the same pair add up */
const groupLines = (lines: StockLine[]) => {
  const grouped = new Map<string, StockLine>();
  for (const line of lines) {
    const prev = grouped.get(stockKey(line));
    grouped.set(stockKey(line), prev ? { ...prev, quantity: prev.quantity + line.quantity } : { ...line });
  }
  return [...grouped.values()];
};

export const findStockShortages = (products: Product[], lines: StockLine[]) =>
  groupLines(lines).filter((line) => {
    const units = products.find((p) => p.id === line.productId)?.stock[line.colorId]?.[line.size] ?? 0;
    return units < line.quantity;
  });

/** Subtracts sold pairs; never goes below zero and reports anything that was oversold */
export const decrementStock = (products: Product[], lines: StockLine[]) => {
  const shortages: StockLine[] = [];
  for (const line of groupLines(lines)) {
    const product = products.find((p) => p.id === line.productId);
    const units = product?.stock[line.colorId]?.[line.size] ?? 0;
    if (units < line.quantity) shortages.push(line);
    if (product?.stock[line.colorId]) product.stock[line.colorId][line.size] = Math.max(0, units - line.quantity);
  }
  return { products, shortages };
};
