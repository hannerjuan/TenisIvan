import { timingSafeEqual } from 'node:crypto';

/** Admin requests carry "Authorization: Bearer <ADMIN_TOKEN>"; a missing or short token locks the admin */
export const isAdmin = (req: Request, env: Record<string, string | undefined> = process.env) => {
  const expected = env.ADMIN_TOKEN;
  // The panel URI-encodes the password so any character (ñ, tildes, €...) survives the header
  let given = req.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
  try {
    given = decodeURIComponent(given);
  } catch {
    // not encoded: compare as sent
  }
  if (!expected || expected.length < 12) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
};

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers }
  });
