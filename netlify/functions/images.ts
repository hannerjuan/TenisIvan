import { imagesStore } from '../../server/store';

const KEY_RE = /^[\w-]+\.(jpg|png|webp)$/;

/** Serves product photos uploaded from the admin panel */
export default async (req: Request) => {
  const key = new URL(req.url).pathname.split('/').pop() ?? '';
  if (!KEY_RE.test(key)) return new Response('Not found', { status: 404 });

  const result = await imagesStore().getWithMetadata(key, { type: 'arrayBuffer' });
  if (!result) return new Response('Not found', { status: 404 });

  return new Response(result.data, {
    headers: {
      'Content-Type': String(result.metadata.contentType ?? 'image/jpeg'),
      // Keys are unique per upload, so the file never changes
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
};

export const config = { path: '/api/images/*' };
