import assert from 'node:assert/strict';
import checkout from '../netlify/functions/checkout';
import orderStatus from '../netlify/functions/order-status';
import events from '../netlify/functions/wompi-events';
import orders from '../netlify/functions/orders';
import adminProducts from '../netlify/functions/admin-products';
import adminImages from '../netlify/functions/admin-images';
import images from '../netlify/functions/images';

// Guard paths only: everything here must answer before touching storage

const post = (url: string, body: unknown) =>
  new Request(url, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
const auth = (token: string, init: RequestInit = {}) => ({ ...init, headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}` } });

delete process.env.WOMPI_PUBLIC_KEY;
assert.equal((await checkout(post('https://t.app/api/checkout', {}))).status, 503, 'payments not configured');
assert.equal((await orderStatus(new Request('https://t.app/api/order-status?id=1'))).status, 503);

process.env.WOMPI_PUBLIC_KEY = 'pub_test_x';
process.env.WOMPI_INTEGRITY_SECRET = 'integ';
process.env.WOMPI_EVENTS_SECRET = 'ev';
assert.equal((await checkout(new Request('https://t.app/api/checkout'))).status, 405);
assert.equal((await checkout(new Request('https://t.app/api/checkout', { method: 'POST', body: 'nope' }))).status, 400);
assert.equal((await checkout(post('https://t.app/api/checkout', { items: [], customer: { email: 'x' } }))).status, 400);
assert.equal((await orderStatus(new Request('https://t.app/api/order-status?id=../../etc'))).status, 400);
assert.equal(
  (await events(post('https://t.app/api/wompi-events', { event: 'transaction.updated', data: { transaction: { id: '1' } }, signature: { properties: ['transaction.id'], checksum: 'bad' }, timestamp: 1 }))).status,
  401,
  'forged webhook rejected'
);
console.log('checkout + webhook guards ok');

delete process.env.ADMIN_TOKEN;
assert.equal((await orders(new Request('https://t.app/api/orders', auth('')))).status, 401, 'no token configured -> locked');
process.env.ADMIN_TOKEN = 'short';
assert.equal((await adminProducts(new Request('https://t.app/api/admin/products', auth('short')))).status, 401, 'weak token refused');
process.env.ADMIN_TOKEN = 'a-long-admin-token';
for (const handler of [orders, adminProducts, adminImages]) {
  assert.equal((await handler(new Request('https://t.app/api/x', auth('wrong-token-xxxx')))).status, 401);
}
assert.equal((await adminImages(new Request('https://t.app/api/admin/images', auth('a-long-admin-token')))).status, 405);
assert.equal(
  (await adminImages(new Request('https://t.app/api/admin/images', auth('a-long-admin-token', { method: 'POST', body: '<svg/>', headers: { 'Content-Type': 'image/svg+xml' } })))).status,
  415,
  'only jpg/png/webp'
);
assert.equal(
  (await adminImages(new Request('https://t.app/api/admin/images', auth('a-long-admin-token', { method: 'POST', body: new Uint8Array(5 * 1024 * 1024), headers: { 'Content-Type': 'image/jpeg' } })))).status,
  413,
  'max 4 MB'
);
assert.equal((await images(new Request('https://t.app/api/images/..%2Fsecret'))).status, 404);
process.env.ADMIN_TOKEN = 'contraseña-€-larga';
const encoded = new Request('https://t.app/api/x', auth(encodeURIComponent('contraseña-€-larga')));
const { isAdmin } = await import('../server/auth');
assert.equal(isAdmin(encoded), true, 'non-Latin-1 passwords work when URI-encoded');
assert.equal(isAdmin(new Request('https://t.app/api/x', auth(encodeURIComponent('contraseña-€-larg0')))), false);
console.log('admin guards ok');
