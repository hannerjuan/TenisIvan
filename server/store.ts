import { getStore } from '@netlify/blobs';
import type { JsonStore } from './kv';

/** Strong consistency so a read right after a write (webhook, stock) sees the new value */
const store = (name: string) => getStore({ name, consistency: 'strong' });

export const ordersStore = (): JsonStore => store('orders');
export const catalogStore = (): JsonStore => store('catalog');
export const imagesStore = () => store('images');
