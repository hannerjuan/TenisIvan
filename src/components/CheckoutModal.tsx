import React, { useEffect, useState } from 'react';
import { X, Check, CreditCard, Lock, ArrowRight, Landmark, Smartphone, Loader2, Info } from 'lucide-react';
import { CartItem } from './CartDrawer';
import { formatPrice } from '../utils/format';
import { calculateTotals } from '../utils/pricing';
import { isLivePayments, startCheckout } from '../utils/payments';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  couponCode: string;
  onCompleteOrder: () => void;
}

const PAYMENT_METHODS = [
  { id: 'pse', name: 'PSE', detail: 'Débito desde tu cuenta de ahorros o corriente', icon: Landmark, color: 'bg-pool-soft' },
  { id: 'nequi', name: 'Nequi', detail: 'Aprueba el pago en tu app Nequi', icon: Smartphone, color: 'bg-bubble-soft' },
  { id: 'card', name: 'Tarjeta', detail: 'Crédito o débito Visa y Mastercard', icon: CreditCard, color: 'bg-sun-soft' }
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  couponCode,
  onCompleteOrder
}) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  const [orderNumber, setOrderNumber] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setStep('shipping');
      onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { total, shippingCost } = calculateTotals(items, couponCode);
  const pairCount = items.reduce((acc, i) => acc + i.quantity, 0);

  // Reset to the first step so a new purchase never reopens on the success screen
  const handleClose = () => {
    setStep('shipping');
    setPaymentError('');
    onClose();
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    if (!isLivePayments) {
      setOrderNumber(`TIVAN-DEMO-${Math.floor(100000 + Math.random() * 900000)}`);
      setStep('success');
      onCompleteOrder();
      return;
    }

    setIsRedirecting(true);
    try {
      const checkoutUrl = await startCheckout(items, couponCode, {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode
      });
      window.location.assign(checkoutUrl);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'No pudimos iniciar el pago.');
      setIsRedirecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="relative w-full max-w-2xl bg-cream rounded-[2rem] shadow-pop-lg overflow-hidden border-2 border-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-ink bg-grape text-white">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-lime" />
            <h3 id="checkout-title" className="font-display text-xl font-extrabold">
              {step === 'shipping' && 'Paso 1 de 2: Dirección de Envío'}
              {step === 'payment' && 'Paso 2 de 2: Pago seguro'}
              {step === 'success' && '¡Pedido de prueba listo!'}
            </h3>
          </div>
          {step !== 'success' && (
            <button
              onClick={handleClose}
              aria-label="Cerrar checkout"
              className="w-10 h-10 rounded-full bg-white text-ink border-2 border-ink flex items-center justify-center hover:rotate-90 transition-transform cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {step === 'shipping' && (
            <form onSubmit={handleSubmitShipping} className="space-y-4 text-sm">
              <div className="p-4 bg-white border-2 border-ink rounded-2xl flex flex-wrap gap-2 items-center justify-between">
                <span>Total a abonar: <strong>{formatPrice(total)}</strong> ({pairCount} {pairCount === 1 ? 'par' : 'pares'})</span>
                <span className="bg-lime border-2 border-ink rounded-full px-3 py-0.5 text-xs font-extrabold">{shippingCost === 0 ? 'Envío GRATIS' : `Envío ${formatPrice(shippingCost)}`}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    placeholder="Ej. Ana García"
                    autoComplete="name"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-2xl focus:outline-hidden focus:shadow-pop-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Email de confirmación *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    placeholder="tu@email.com"
                    autoComplete="email"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-2xl focus:outline-hidden focus:shadow-pop-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Teléfono móvil *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    placeholder="+57 300 123 4567"
                    autoComplete="tel"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-2xl focus:outline-hidden focus:shadow-pop-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">Dirección de entrega *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    placeholder="Ej. Calle 85 # 11-53, apto 302"
                    autoComplete="street-address"
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-2xl focus:outline-hidden focus:shadow-pop-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Ciudad *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    placeholder="Ej. Bogotá"
                    autoComplete="address-level2"
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-2xl focus:outline-hidden focus:shadow-pop-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Código Postal *</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    placeholder="Ej. 110111"
                    autoComplete="postal-code"
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-2xl focus:outline-hidden focus:shadow-pop-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-lime border-2 border-ink font-extrabold rounded-full flex items-center gap-2 shadow-pop hover:shadow-pop-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Continuar al Pago
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handleProcessPayment} className="space-y-5 text-sm">
              <div className="space-y-2">
                <h4 className="font-extrabold">Puedes pagar con:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map(({ id, name, detail, icon: Icon, color }) => (
                    <li key={id} className={`p-4 rounded-2xl border-2 border-ink ${color}`}>
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="block font-display text-xl font-extrabold">{name}</span>
                      <span className="block text-xs text-ink/70">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {isLivePayments ? (
                <p className="flex gap-2 p-4 bg-white border-2 border-ink rounded-2xl">
                  <Lock className="w-5 h-5 shrink-0" />
                  <span>
                    Te llevaremos a <strong>Wompi</strong>, la pasarela segura de Bancolombia, para elegir tu banco en PSE,
                    aprobar en Nequi o pagar con tarjeta. Al terminar volverás a TenisIvan.
                  </span>
                </p>
              ) : (
                <p className="flex gap-2 p-4 bg-sun border-2 border-ink rounded-2xl" role="note">
                  <Info className="w-5 h-5 shrink-0" />
                  <span>
                    <strong>Modo demostración:</strong> los pagos reales todavía no están activados, así que no se cobrará nada.
                  </span>
                </p>
              )}

              {paymentError && (
                <p className="p-4 bg-bubble-soft border-2 border-ink rounded-2xl font-bold" role="alert">
                  {paymentError}
                </p>
              )}

              <div className="pt-4 border-t-2 border-ink flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="font-bold underline underline-offset-4 hover:text-grape cursor-pointer"
                >
                  Volver a la dirección
                </button>
                <button
                  type="submit"
                  disabled={isRedirecting}
                  className="px-6 py-3 bg-lime border-2 border-ink font-extrabold rounded-full flex items-center gap-2 shadow-pop hover:shadow-pop-lg hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >
                  {isRedirecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {isRedirecting
                    ? 'Conectando con Wompi...'
                    : isLivePayments
                    ? `Pagar ${formatPrice(total)}`
                    : `Simular pago de ${formatPrice(total)}`}
                </button>
              </div>
            </form>
          )}

          {/* Only reached in demo mode; real payments return through PaymentResultModal */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-lime border-2 border-ink shadow-pop mx-auto flex items-center justify-center -rotate-6">
                <Check className="w-10 h-10" strokeWidth={3} />
              </div>

              <div className="space-y-1">
                <h4 className="font-display text-3xl font-extrabold">
                  ¡Gracias por tu compra, {formData.name.split(' ')[0]}!
                </h4>
                <p className="text-sm text-ink/60">
                  Este pedido fue una simulación: no se realizó ningún cobro.
                </p>
              </div>

              <div className="p-4 bg-white border-2 border-ink rounded-2xl max-w-sm mx-auto text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span>Número de Pedido:</span>
                  <strong className="text-ink font-mono">{orderNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Entrega estimada:</span>
                  <strong className="text-grape">En 24-48 horas</strong>
                </div>
                <div className="flex justify-between">
                  <span>Dirección:</span>
                  <span className="truncate max-w-[180px]">{formData.address}, {formData.city}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-ink text-white font-extrabold rounded-full hover:bg-grape transition-colors cursor-pointer"
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
