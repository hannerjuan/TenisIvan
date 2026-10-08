import type { CartItem } from '../components/CartDrawer';

export const isLivePayments = import.meta.env.VITE_PAYMENTS_MODE === 'wompi';

export interface CheckoutCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export type PaymentStatus = 'APPROVED' | 'PENDING' | 'DECLINED' | 'VOIDED' | 'ERROR';

export interface PaymentResult {
  status: PaymentStatus;
  reference: string;
  total: number;
  paymentMethod: string | null;
}

const readError = async (response: Response) => {
  try {
    return ((await response.json()) as { error?: string }).error ?? 'Algo salió mal.';
  } catch {
    return 'No pudimos conectar con el servidor de pagos.';
  }
};

/** Asks the server to price the bag and returns the signed Wompi checkout URL */
export const startCheckout = async (items: CartItem[], couponCode: string, customer: CheckoutCustomer) => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: items.map(({ productId, size, colorName, quantity }) => ({ productId, size, colorName, quantity })),
      couponCode,
      customer
    })
  });
  if (!response.ok) throw new Error(await readError(response));
  return ((await response.json()) as { checkoutUrl: string }).checkoutUrl;
};

export const fetchPaymentResult = async (transactionId: string): Promise<PaymentResult> => {
  const response = await fetch(`/api/order-status?id=${encodeURIComponent(transactionId)}`);
  if (!response.ok) throw new Error(await readError(response));
  return response.json();
};
