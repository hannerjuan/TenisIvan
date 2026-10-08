import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { priceOrder, OrderError } from '../server/order';
import { integritySignature, buildCheckoutUrl, verifyEventChecksum, getWompiConfig } from '../server/wompi';
import { saveOrder, applyTransaction, listOrders, OrderStore, Order } from '../server/orders';

const memory = (): OrderStore => {
  const m = new Map<string, unknown>();
  return {
    setJSON: async (k, v) => { m.set(k, JSON.parse(JSON.stringify(v))); },
    get: async (k) => m.get(k) ?? null,
    list: async () => ({ blobs: [...m.keys()].map((key) => ({ key })) })
  };
};

// pricing
const { lines, totals } = priceOrder([{ productId: 'flux-runner', size: '41', colorName: 'Rojo Fuego', quantity: 2 }], 'bienvenida10');
assert.equal(totals.subtotal, 959800); assert.equal(totals.discountAmount, 95980); assert.equal(totals.total, 863820);
assert.equal(lines[0].title, 'Flux Runner');
assert.throws(() => priceOrder([{ productId: 'flux-runner', size: '44', colorName: 'Rojo Fuego', quantity: 1 }]), OrderError, 'sold out size');
assert.throws(() => priceOrder([{ productId: 'nope', size: '40', colorName: 'x', quantity: 1 }]), OrderError);
assert.throws(() => priceOrder([{ productId: 'flux-runner', size: '41', colorName: 'Rojo Fuego', quantity: 0 }]), OrderError);
assert.throws(() => priceOrder([]), OrderError);
assert.equal(priceOrder([{ productId: 'flux-runner', size: '41', colorName: 'Rojo Fuego', quantity: 1, price: 1 } as any]).totals.subtotal, 479900, 'ignores client price');
console.log('pricing ok');

// config
assert.equal(getWompiConfig({}), null);
assert.equal(getWompiConfig({ WOMPI_PUBLIC_KEY: 'pub_test_x', WOMPI_INTEGRITY_SECRET: 's' })!.apiBase, 'https://sandbox.wompi.co/v1');
assert.equal(getWompiConfig({ WOMPI_PUBLIC_KEY: 'pub_prod_x', WOMPI_INTEGRITY_SECRET: 's' })!.apiBase, 'https://production.wompi.co/v1');

// signature & url
const sig = integritySignature('TIVAN-1', 86382000, 'COP', 'secret');
assert.equal(sig, createHash('sha256').update('TIVAN-186382000COPsecret').digest('hex'));
const url = new URL(buildCheckoutUrl({ config: getWompiConfig({ WOMPI_PUBLIC_KEY: 'pub_test_x', WOMPI_INTEGRITY_SECRET: 'secret' })!, reference: 'TIVAN-1', amountInCents: 86382000, redirectUrl: 'https://t.netlify.app/', customer: { email: 'a@b.co', fullName: 'Ana' } }));
assert.equal(url.origin + url.pathname, 'https://checkout.wompi.co/p/');
assert.equal(url.searchParams.get('signature:integrity'), sig);
assert.equal(url.searchParams.get('amount-in-cents'), '86382000');
console.log('signature ok');

// webhook checksum
const tx = { id: '1234-1610641025-49201', status: 'APPROVED', amount_in_cents: 86382000, reference: 'TIVAN-1', payment_method_type: 'NEQUI' };
const ts = 1530291411;
const checksum = createHash('sha256').update(`${tx.id}${tx.status}${tx.amount_in_cents}${ts}evsecret`).digest('hex');
const event = { event: 'transaction.updated', data: { transaction: tx }, signature: { properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'], checksum: checksum.toUpperCase() }, timestamp: ts };
assert.equal(verifyEventChecksum(event, 'evsecret'), true);
assert.equal(verifyEventChecksum(event, 'wrong'), false);
assert.equal(verifyEventChecksum({ ...event, data: { transaction: { ...tx, status: 'DECLINED' } } }, 'evsecret'), false, 'tampered');
assert.equal(verifyEventChecksum({ ...event, signature: undefined }, 'evsecret'), false);
console.log('checksum ok');

// orders
const store = memory();
const now = new Date().toISOString();
const order: Order = { reference: 'TIVAN-1', createdAt: now, updatedAt: now, status: 'PENDING', customer: { fullName: 'Ana', email: 'a@b.co', phone: '3001234567', address: 'Calle 1', city: 'Bogotá', postalCode: '110111' }, lines, totals };
await saveOrder(store, order);
assert.equal((await applyTransaction(store, tx))!.status, 'APPROVED');
assert.equal((await applyTransaction(store, { ...tx, amount_in_cents: 100 }))!.status, 'ERROR', 'amount mismatch never approves');
assert.equal((await applyTransaction(store, { ...tx, status: 'DECLINED' }))!.status, 'DECLINED');
assert.equal(await applyTransaction(store, { ...tx, reference: 'TIVAN-unknown' }), null);
assert.equal((await listOrders(store)).length, 1);
console.log('orders ok');
