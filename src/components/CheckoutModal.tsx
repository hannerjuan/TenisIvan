import React, { useState } from 'react';
import { X, Check, ShieldCheck, Truck, CreditCard, Lock, ArrowRight } from 'lucide-react';
import { CartItem } from './CartDrawer';

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
    name: 'Alex Morales',
    email: 'alex.morales@ejemplo.com',
    address: 'Calle Mayor 45, 3º B',
    city: 'Madrid',
    postalCode: '28013',
    phone: '+34 612 345 678',
    paymentMethod: 'card'
  });
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const total = subtotal - discountAmount + shippingCost;

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedOrder = `NOMAD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedOrder);
    setStep('success');
    onCompleteOrder();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="font-display text-base font-bold text-stone-900">
              {step === 'shipping' && 'Paso 1 de 2: Dirección de Envío'}
              {step === 'payment' && 'Paso 2 de 2: Método de Pago Seguro'}
              {step === 'success' && '¡Pedido Confirmado con Éxito!'}
            </h3>
          </div>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {step === 'shipping' && (
            <form onSubmit={handleSubmitShipping} className="space-y-4 text-xs">
              <div className="p-3 bg-stone-100 rounded-lg text-stone-700 flex items-center justify-between">
                <span>Total a abonar: <strong>${total.toFixed(2)}</strong> ({items.reduce((acc, i) => acc + i.quantity, 0)} prendas)</span>
                <span className="text-emerald-700 font-semibold">{shippingCost === 0 ? 'Envío Express GRATIS' : 'Envío $4.95'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Email de confirmación *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Teléfono móvil *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Dirección de entrega *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Ciudad *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Código Postal *</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  Continuar al Pago
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="block text-stone-800 font-semibold">Elige cómo quieres pagar:</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900/10'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-stone-800 mb-1" />
                    <span className="font-bold text-stone-900 block">Tarjeta Bancaria</span>
                    <span className="text-[10px] text-stone-500">Visa, Mastercard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'klarna' })}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.paymentMethod === 'klarna'
                        ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900/10'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span className="font-black text-rose-500 text-sm block mb-1">Klarna.</span>
                    <span className="font-bold text-stone-900 block">3 Cuotas sin interés</span>
                    <span className="text-[10px] text-stone-500">3x ${(total / 3).toFixed(2)}/mes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.paymentMethod === 'paypal'
                        ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900/10'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span className="font-bold text-blue-600 text-sm block mb-1">PayPal</span>
                    <span className="font-bold text-stone-900 block">1 Clic Seguro</span>
                    <span className="text-[10px] text-stone-500">Sin meter tarjeta</span>
                  </button>
                </div>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Número de Tarjeta</label>
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 8892"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-800 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Caducidad</label>
                      <input
                        type="text"
                        defaultValue="08/28"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        defaultValue="921"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-800 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-stone-600 hover:text-stone-900 font-medium"
                >
                  Volver a Dirección
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Pagar ${total.toFixed(2)} Ahora
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-display text-xl font-bold text-stone-900">
                  ¡Gracias por tu compra, {formData.name.split(' ')[0]}!
                </h4>
                <p className="text-xs text-stone-500">
                  Hemos enviado la confirmación y el comprobante a <strong>{formData.email}</strong>.
                </p>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl max-w-sm mx-auto text-xs space-y-1.5 text-stone-700">
                <div className="flex justify-between">
                  <span>Número de Pedido:</span>
                  <strong className="text-stone-900 font-mono">{orderNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Entrega estimada:</span>
                  <strong className="text-emerald-700">En 24-48 horas</strong>
                </div>
                <div className="flex justify-between">
                  <span>Dirección:</span>
                  <span className="truncate max-w-[180px]">{formData.address}, {formData.city}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-stone-900 text-white font-semibold rounded-lg text-xs hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Seguir Comprando en NOMAD
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
