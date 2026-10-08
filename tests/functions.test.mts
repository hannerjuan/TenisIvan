import assert from 'node:assert/strict';
import checkout from '../netlify/functions/checkout';
import orderStatus from '../netlify/functions/order-status';
import events from '../netlify/functions/wompi-events';
import orders from '../netlify/functions/orders';

const post = (url: string, body: unknown) => new Request(url, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });

// not configured
delete process.env.WOMPI_PUBLIC_KEY;
assert.equal((await checkout(post('https://t.app/api/checkout', {}))).status, 503);
assert.equal((await orderStatus(new Request('https://t.app/api/order-status?id=1'))).status, 503);

process.env.WOMPI_PUBLIC_KEY = 'pub_test_x';
process.env.WOMPI_INTEGRITY_SECRET = 'integ';
process.env.WOMPI_EVENTS_SECRET = 'ev';
assert.equal((await checkout(new Request('https://t.app/api/checkout'))).status, 405);
assert.equal((await checkout(new Request('https://t.app/api/checkout', { method: 'POST', body: 'nope' }))).status, 400);
const badCustomer = await checkout(post('https://t.app/api/checkout', { items: [], customer: { email: 'x' } }));
assert.equal(badCustomer.status, 400);
const customer = { fullName: 'Ana', email: 'a@b.co', phone: '300', address: 'C 1', city: 'Bogotá', postalCode: '110111' };
const soldOut = await checkout(post('https://t.app/api/checkout', { items: [{ productId: 'flux-runner', size: '44', colorName: 'Rojo Fuego', quantity: 1 }], customer }));
assert.equal(soldOut.status, 422);
console.log('checkout validation ok:', (await soldOut.json()).error);

assert.equal((await orderStatus(new Request('https://t.app/api/order-status?id=../../etc'))).status, 400);
assert.equal((await events(post('https://t.app/api/wompi-events', { event: 'transaction.updated', data: { transaction: { id: '1' } }, signature: { properties: ['transaction.id'], checksum: 'bad' }, timestamp: 1 }))).status, 401);
console.log('events rejects forged signature ok');

delete process.env.ADMIN_TOKEN;
assert.equal((await orders(new Request('https://t.app/api/orders', { headers: { Authorization: 'Bearer ' } }))).status, 401, 'no token configured -> locked');
process.env.ADMIN_TOKEN = 'short';
assert.equal((await orders(new Request('https://t.app/api/orders', { headers: { Authorization: 'Bearer short' } }))).status, 401, 'weak token refused');
process.env.ADMIN_TOKEN = 'a-long-admin-token';
assert.equal((await orders(new Request('https://t.app/api/orders', { headers: { Authorization: 'Bearer wrong-token-xxxx' } }))).status, 401);
console.log('orders auth ok');
