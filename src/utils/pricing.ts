import { BRAND_INFO } from '../data/catalog';

/** Shared by the storefront and the payment functions so both always agree on the total */

export const getDiscountRate = (couponCode: string | undefined) =>
  couponCode?.trim().toUpperCase() === BRAND_INFO.welcomeCode ? 0.1 : 0;

export interface OrderTotals {
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
}

export const calculateTotals = (items: { price: number; quantity: number }[], couponCode?: string): OrderTotals => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * getDiscountRate(couponCode));
  const shippingCost = subtotal >= BRAND_INFO.freeShippingFrom ? 0 : BRAND_INFO.shippingCost;
  return { subtotal, discountAmount, shippingCost, total: subtotal - discountAmount + shippingCost };
};
