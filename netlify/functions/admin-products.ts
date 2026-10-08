import { readCatalog, sanitizeProduct, updateCatalog, ValidationError } from '../../server/catalog';
import { catalogStore } from '../../server/store';
import { isAdmin, json } from '../../server/auth';
import { SAMPLE_PRODUCTS } from '../../src/data/catalog';

/**
 * Admin catalog API (password = ADMIN_TOKEN)
 * GET    list every product, published or not
 * PUT    create or update one product: { product }
 * DELETE remove a product: ?id=<id>
 * POST   { action: "import-sample" } loads the example catalog as hidden drafts
 */
export default async (req: Request) => {
  if (!isAdmin(req)) return json({ error: 'Contraseña incorrecta.' }, 401);
  const store = catalogStore();

  try {
    if (req.method === 'GET') return json({ products: await readCatalog(store) });

    if (req.method === 'PUT') {
      const body = (await req.json().catch(() => ({}))) as { product?: unknown };
      const product = sanitizeProduct(body.product);
      const products = await updateCatalog(store, (current) => {
        const index = current.findIndex((p) => p.id === product.id);
        return index === -1 ? [product, ...current] : current.map((p, i) => (i === index ? product : p));
      });
      return json({ product, products });
    }

    if (req.method === 'DELETE') {
      const id = new URL(req.url).searchParams.get('id');
      const products = await updateCatalog(store, (current) => current.filter((p) => p.id !== id));
      return json({ products });
    }

    if (req.method === 'POST') {
      const body = (await req.json().catch(() => ({}))) as { action?: string };
      if (body.action !== 'import-sample') return json({ error: 'Acción no válida.' }, 400);
      const products = await updateCatalog(store, (current) => {
        const existing = new Set(current.map((p) => p.id));
        // Example products start hidden so they are never sold by accident
        const drafts = SAMPLE_PRODUCTS.filter((p) => !existing.has(p.id)).map((p) => ({ ...p, published: false }));
        return [...current, ...drafts];
      });
      return json({ products });
    }

    return json({ error: 'Método no permitido' }, 405);
  } catch (error) {
    if (error instanceof ValidationError) return json({ error: error.message }, 422);
    console.error('admin products failed', error);
    return json({ error: 'No se pudo guardar. Inténtalo de nuevo.' }, 500);
  }
};

export const config = { path: '/api/admin/products' };
