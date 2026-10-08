import React, { useEffect, useState } from 'react';
import { X, Check, ShieldCheck, Truck, CreditCard, Lock, ArrowRight } from 'lucide-react';
import { CartItem } from './CartDrawer';
import { formatPrice } from '../utils/format';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  onCompleteOrder: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discountAmount,
  shippingCost,
  onCompleteOrder
}) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'card'
  });
  const [orderNumber, setOrderNumber] = useState('');

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

  const total = subtotal - discountAmount + shippingCost;
  const pairCount = items.reduce((acc, i) => acc + i.quantity, 0);

  // Reset to the first step so a new purchase never reopens on the success screen
  const handleClose = () => {
    setStep('shipping');
    onClose();
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedOrder = `TIVAN-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedOrder);
    setStep('success');
    onCompleteOrder();
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
              {step === 'payment' && 'Paso 2 de 2: Método de Pago Seguro'}
              {step === 'success' && '¡Pedido Confirmado con Éxito!'}
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
            <form onSubmit={handleProcessPayment} className="space-y-4 text-sm">
              <div className="space-y-2">
                <label className="block font-extrabold">Elige cómo quieres pagar:</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-4 rounded-2xl border-2 border-ink text-left cursor-pointer transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'bg-lime shadow-pop -translate-y-0.5'
                        : 'bg-white hover:bg-lime-soft'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-ink mb-1" />
                    <span className="font-bold text-ink block">Tarjeta Bancaria</span>
                    <span className="text-[10px] text-ink/60">Visa, Mastercard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'klarna' })}
                    className={`p-4 rounded-2xl border-2 border-ink text-left cursor-pointer transition-all ${
                      formData.paymentMethod === 'klarna'
                        ? 'bg-lime shadow-pop -translate-y-0.5'
                        : 'bg-white hover:bg-lime-soft'
                    }`}
                  >
                    <span className="font-black text-rose-500 text-sm block mb-1">Klarna.</span>
                    <span className="font-bold text-ink block">3 Cuotas sin interés</span>
                    <span className="text-[10px] text-ink/60">3x {formatPrice((total / 3))}/mes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                    className={`p-4 rounded-2xl border-2 border-ink text-left cursor-pointer transition-all ${
                      formData.paymentMethod === 'paypal'
                        ? 'bg-lime shadow-pop -translate-y-0.5'
                        : 'bg-white hover:bg-lime-soft'
                    }`}
                  >
                    <span className="font-bold text-blue-600 text-sm block mb-1">PayPal</span>
                    <span className="font-bold text-ink block">1 Clic Seguro</span>
                    <span className="text-[10px] text-ink/60">Sin meter tarjeta</span>
                  </button>
                </div>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="p-4 bg-white rounded-2xl border-2 border-ink space-y-3">
                  <div>
                    <label className="block font-bold mb-1">Número de Tarjeta</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-2xl focus:outline-hidden focus:shadow-pop-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">Caducidad</label>
                      <input
                        type="text"
                        autoComplete="cc-exp"
                        placeholder="MM/AA"
                        className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-2xl focus:outline-hidden focus:shadow-pop-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="123"
                        className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-2xl focus:outline-hidden focus:shadow-pop-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t-2 border-ink flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="font-bold underline underline-offset-4 hover:text-grape cursor-pointer"
                >
                  Volver a Dirección
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-lime border-2 border-ink font-extrabold rounded-full flex items-center gap-2 shadow-pop hover:shadow-pop-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Pagar {formatPrice(total)} Ahora
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-lime border-2 border-ink shadow-pop mx-auto flex items-center justify-center -rotate-6">
                <Check className="w-10 h-10" strokeWidth={3} />
              </div>

              <div className="space-y-1">
                <h4 className="font-display text-3xl font-extrabold">
                  ¡Gracias por tu compra, {formData.name.split(' ')[0]}!
                </h4>
                <p className="text-xs text-ink/60">
                  Hemos enviado la confirmación y el comprobante a <strong>{formData.email}</strong>.
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
