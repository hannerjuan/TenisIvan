import { getStore } from '@netlify/blobs';
import type { OrderStore } from './orders';

/** Orders live in a Netlify Blobs store; strong consistency so the webhook sees fresh orders */
export const ordersStore = (): OrderStore => getStore({ name: 'orders', consistency: 'strong' });
