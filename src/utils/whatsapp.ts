import type { CartItem } from '../components/CartDrawer';
import { BRAND_INFO } from '../data/catalog';
import { formatPrice } from './format';
import { calculateTotals } from './pricing';

export interface WhatsAppCustomer {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

/** Order summary the customer sends to the store to finish the purchase over WhatsApp */
export const buildOrderMessage = (items: CartItem[], couponCode: string, customer: WhatsAppCustomer) => {
  const { subtotal, discountAmount, shippingCost, total } = calculateTotals(items, couponCode);
  const lines = [
    `¡Hola ${BRAND_INFO.name}! Quiero hacer este pedido:`,
    '',
    ...items.map((i) => `• ${i.quantity} x ${i.title} (${i.colorName}, talla ${i.size}) - ${formatPrice(i.price * i.quantity)}`),
    '',
    `Subtotal: ${formatPrice(subtotal)}`,
    ...(discountAmount > 0 ? [`Descuento (${couponCode.trim().toUpperCase()}): -${formatPrice(discountAmount)}`] : []),
    `Envío: ${shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}`,
    `*Total: ${formatPrice(total)}*`,
    '',
    'Mis datos:',
    `Nombre: ${customer.name}`,
    `Teléfono: ${customer.phone}`,
    `Dirección: ${customer.address}, ${customer.city}`,
    ...(customer.notes.trim() ? [`Notas: ${customer.notes.trim()}`] : [])
  ];
  return lines.join('\n');
};

export const whatsappUrl = (message: string) =>
  `https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
