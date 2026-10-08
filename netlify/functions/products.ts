import { readCatalog } from '../../server/catalog';
import { catalogStore } from '../../server/store';
import { json } from '../../server/auth';

/** Public catalog: only published products */
export default async () => {
  const products = (await readCatalog(catalogStore())).filter((p) => p.published);
  return json({ products }, 200, { 'Cache-Control': 'public, max-age=30' });
};

export const config = { path: '/api/products' };
