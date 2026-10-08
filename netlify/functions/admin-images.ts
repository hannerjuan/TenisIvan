import { randomBytes } from 'node:crypto';
import { imagesStore } from '../../server/store';
import { isAdmin, json } from '../../server/auth';

const TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_BYTES = 4 * 1024 * 1024;

/** Stores a product photo uploaded from the admin panel and returns its public URL */
export default async (req: Request) => {
  if (!isAdmin(req)) return json({ error: 'Contraseña incorrecta.' }, 401);
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  const contentType = req.headers.get('content-type')?.split(';')[0] ?? '';
  const extension = TYPES[contentType];
  if (!extension) return json({ error: 'Sube una foto JPG, PNG o WebP.' }, 415);

  const data = await req.arrayBuffer();
  if (!data.byteLength || data.byteLength > MAX_BYTES) return json({ error: 'La foto debe pesar menos de 4 MB.' }, 413);

  const key = `${Date.now()}-${randomBytes(6).toString('hex')}.${extension}`;
  await imagesStore().set(key, data, { metadata: { contentType } });
  return json({ url: `/api/images/${key}` });
};

export const config = { path: '/api/admin/images' };
