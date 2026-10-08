import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { priceOrder, OrderError } from '../server/order';
import { integritySignature, buildCheckoutUrl, verifyEventChecksum, getWompiConfig } from '../server/wompi';
import { saveOrder, applyTransaction, listOrders, getOrder, Order } from '../server/orders';
import { readCatalog, updateCatalog, sanitizeProduct, ValidationError } from '../server/catalog';
import { SAMPLE_PRODUCTS } from '../src/data/catalog';
import { memoryStore } from './memoryStore.mts';

const catalog = structuredClone(SAMPLE_PRODUCTS);
const flux = catalog.find((p) => p.id === 'flux-runner')!;
const line = (quantity: number, size = '41') => ({ productId: 'flux-runner', colorId: 'fire', size, quantity });

// ---------- pricing & stock checks ----------
const { lines, totals } = priceOrder(catalog, [line(2)], 'bienvenida10');
assert.equal(totals.subtotal, 959800);
assert.equal(totals.discountAmount, 95980);
assert.equal(totals.total, 863820);
assert.equal(lines[0].colorName, 'Rojo Fuego');
assert.throws(() => priceOrder(catalog, [line(1, '44')]), OrderError, 'sold-out size');
assert.throws(() => priceOrder(catalog, [line(5, '42')]), OrderError, 'only 2 left in 42');
assert.throws(() => priceOrder(catalog, [line(2, '42'), line(1, '42')]), OrderError, 'two lines add up past stock');
assert.throws(() => priceOrder(catalog, [{ ...line(1), colorId: 'nope' }]), OrderError);
assert.throws(() => priceOrder(catalog, [{ ...line(1), productId: 'nope' }]), OrderError);
assert.throws(() => priceOrder(catalog.map((p) => ({ ...p, published: false })), [line(1)]), OrderError, 'hidden product');
assert.throws(() => priceOrder(catalog, [line(0)]), OrderError);
assert.throws(() => priceOrder(catalog, []), OrderError);
assert.equal(priceOrder(catalog, [{ ...line(1), price: 1 } as any]).totals.subtotal, 479900, 'ignores client price');
console.log('pricing + stock checks ok');

// ---------- product validation ----------
const valid = sanitizeProduct({ ...flux, id: '', title: 'Nuevo Modelo Ñandú' });
assert.match(valid.id, /^nuevo-modelo-nandu-[0-9a-f]{4}$/);
assert.deepEqual(Object.keys(valid.stock), flux.colors.map((c) => c.id));
assert.throws(() => sanitizeProduct({ ...flux, title: '' }), ValidationError);
assert.throws(() => sanitizeProduct({ ...flux, price: 10.5 }), ValidationError);
assert.throws(() => sanitizeProduct({ ...flux, originalPrice: 1000 }), ValidationError, 'old price below price');
assert.throws(() => sanitizeProduct({ ...flux, category: 'tacones' }), ValidationError);
assert.throws(() => sanitizeProduct({ ...flux, sizes: [] }), ValidationError);
assert.throws(() => sanitizeProduct({ ...flux, colors: flux.colors.map((c) => ({ ...c, images: [] })) }), ValidationError, 'needs a photo');
assert.throws(() => sanitizeProduct({ ...flux, stock: { fire: { '41': -1 } } }), ValidationError);
const scrubbed = sanitizeProduct({ ...flux, colors: [{ ...flux.colors[0], images: ['javascript:alert(1)', 'https://ok.example/a.jpg', '/api/images/x.jpg'] }] });
assert.deepEqual(scrubbed.colors[0].images, ['https://ok.example/a.jpg', '/api/images/x.jpg'], 'unsafe image URLs dropped');
console.log('product validation ok');

// ---------- wompi ----------
assert.equal(getWompiConfig({}), null);
assert.equal(getWompiConfig({ WOMPI_PUBLIC_KEY: 'pub_test_x', WOMPI_INTEGRITY_SECRET: 's' })!.apiBase, 'https://sandbox.wompi.co/v1');
assert.equal(getWompiConfig({ WOMPI_PUBLIC_KEY: 'pub_prod_x', WOMPI_INTEGRITY_SECRET: 's' })!.apiBase, 'https://production.wompi.co/v1');
const sig = integritySignature('TIVAN-1', 86382000, 'COP', 'secret');
assert.equal(sig, createHash('sha256').update('TIVAN-186382000COPsecret').digest('hex'));
const url = new URL(buildCheckoutUrl({ config: getWompiConfig({ WOMPI_PUBLIC_KEY: 'pub_test_x', WOMPI_INTEGRITY_SECRET: 'secret' })!, reference: 'TIVAN-1', amountInCents: 86382000, redirectUrl: 'https://t.netlify.app/', customer: { email: 'a@b.co', fullName: 'Ana' } }));
assert.equal(url.origin + url.pathname, 'https://checkout.wompi.co/p/');
assert.equal(url.searchParams.get('signature:integrity'), sig);

const tx = { id: '1234-1610641025-49201', status: 'APPROVED', amount_in_cents: 86382000, reference: 'TIVAN-1', payment_method_type: 'NEQUI' };
const ts = 1530291411;
const checksum = createHash('sha256').update(`${tx.id}${tx.status}${tx.amount_in_cents}${ts}evsecret`).digest('hex');
const event = { event: 'transaction.updated', data: { transaction: tx }, signature: { properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'], checksum: checksum.toUpperCase() }, timestamp: ts };
assert.equal(verifyEventChecksum(event, 'evsecret'), true);
assert.equal(verifyEventChecksum(event, 'wrong'), false);
assert.equal(verifyEventChecksum({ ...event, data: { transaction: { ...tx, status: 'DECLINED' } } }, 'evsecret'), false, 'tampered');
assert.equal(verifyEventChecksum({ ...event, signature: undefined }, 'evsecret'), false);
console.log('wompi signatures ok');

// ---------- orders & stock decrement ----------
const setup = async (quantity = 2) => {
  const stores = { orders: memoryStore(), catalog: memoryStore() };
  await updateCatalog(stores.catalog, () => structuredClone(SAMPLE_PRODUCTS));
  const priced = priceOrder(await readCatalog(stores.catalog), [line(quantity)]);
  const now = new Date().toISOString();
  const order: Order = { reference: 'TIVAN-1', createdAt: now, updatedAt: now, status: 'PENDING', customer: { fullName: 'Ana', email: 'a@b.co', phone: '3001234567', address: 'Calle 1', city: 'Bogotá', postalCode: '110111' }, lines: priced.lines, totals: priced.totals };
  await saveOrder(stores.orders, order);
  return { stores, approved: { ...tx, amount_in_cents: priced.totals.total * 100 } };
};
const fluxUnits = async (stores: { catalog: any }, size = '41') => (await readCatalog(stores.catalog)).find((p) => p.id === 'flux-runner')!.stock.fire[size];

{
  const { stores, approved } = await setup(2);
  assert.equal(await fluxUnits(stores), 8);
  // Webhook and customer return arrive at the same time, several times over
  const results = await Promise.all([1, 2, 3, 4].map(() => applyTransaction(stores, approved)));
  assert.ok(results.every((o) => o!.status === 'APPROVED'));
  assert.equal(await fluxUnits(stores), 6, 'stock taken out exactly once under concurrency');
  await applyTransaction(stores, { ...approved, status: 'PENDING' });
  assert.equal((await getOrder(stores.orders, 'TIVAN-1'))!.status, 'APPROVED', 'late pending event ignored');
  await applyTransaction(stores, { ...approved, status: 'VOIDED' });
  assert.equal((await getOrder(stores.orders, 'TIVAN-1'))!.status, 'VOIDED', 'void is recorded');
  assert.equal(await fluxUnits(stores), 6);
}
{
  const { stores, approved } = await setup(1);
  assert.equal((await applyTransaction(stores, { ...approved, amount_in_cents: 100 }))!.status, 'ERROR', 'amount mismatch never approves');
  assert.equal(await fluxUnits(stores), 8, 'no stock taken for a mismatched payment');
  assert.equal((await applyTransaction(stores, { ...approved, status: 'DECLINED' }))!.status, 'DECLINED');
  assert.equal(await applyTransaction(stores, { ...approved, reference: 'TIVAN-unknown' }), null);
  assert.equal((await listOrders(stores.orders)).length, 1);
}
{
  // Someone else bought the last pairs between checkout and payment
  const { stores, approved } = await setup(2);
  await updateCatalog(stores.catalog, (products) => products.map((p) => (p.id === 'flux-runner' ? { ...p, stock: { ...p.stock, fire: { ...p.stock.fire, '41': 1 } } } : p)));
  const order = await applyTransaction(stores, approved);
  assert.equal(order!.status, 'APPROVED');
  assert.match(order!.stockIssue ?? '', /Flux Runner Rojo Fuego talla 41/);
  assert.equal(await fluxUnits(stores), 0, 'never below zero');
}
{
  // Two different orders for the same pair paid at the same moment: both must be subtracted
  const { stores, approved } = await setup(2);
  const second = { ...(await getOrder(stores.orders, 'TIVAN-1'))!, reference: 'TIVAN-2' };
  await saveOrder(stores.orders, second);
  await Promise.all([
    applyTransaction(stores, approved),
    applyTransaction(stores, { ...approved, id: 'other', reference: 'TIVAN-2' }),
    applyTransaction(stores, approved),
    applyTransaction(stores, { ...approved, id: 'other', reference: 'TIVAN-2' })
  ]);
  assert.equal(await fluxUnits(stores), 4, 'concurrent orders both subtracted, each only once');
}
console.log('orders + stock decrement ok');
