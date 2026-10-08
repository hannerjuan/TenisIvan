import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Truck, ShoppingBag, Tag, Check, Minus, Plus } from 'lucide-react';
import { BRAND_INFO } from '../data/catalog';
import { formatPrice } from '../utils/format';
import { calculateTotals, getDiscountRate } from '../utils/pricing';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  colorName: string;
  size: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (couponCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const { subtotal, discountAmount, shippingCost, total: finalTotal } = calculateTotals(items, appliedCode);
  const difference = BRAND_INFO.freeShippingFrom - subtotal;
  const shippingProgress = Math.min(100, Math.round((subtotal / BRAND_INFO.freeShippingFrom) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (getDiscountRate(couponCode) > 0) {
      setAppliedCode(couponCode.trim().toUpperCase());
      setCouponSuccess('¡Código aplicado! 10% de descuento');
    } else {
      setCouponError(`Código no válido. Prueba con ${BRAND_INFO.welcomeCode}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div role="dialog" aria-modal="true" aria-label="Bolsa de compra" className="w-screen max-w-md bg-cream border-l-2 border-ink flex flex-col">
          <div className="px-5 py-4 border-b-2 border-ink bg-lime flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              Tu bolsa ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
            <button
              onClick={onClose}
              aria-label="Cerrar bolsa"
              className="w-10 h-10 rounded-full bg-white border-2 border-ink flex items-center justify-center hover:rotate-90 transition-transform cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {items.length > 0 && (
            <div className="px-5 py-4 border-b-2 border-ink">
              <p className="flex items-center gap-2 text-sm font-bold mb-2">
                <Truck className="w-4.5 h-4.5" />
                {difference <= 0 ? (
                  <span>¡Tienes envío gratis! 🎉</span>
                ) : (
                  <span>Te faltan <strong className="text-grape">{formatPrice(difference)}</strong> para el envío gratis</span>
                )}
              </p>
              <div className="h-3 bg-white border-2 border-ink rounded-full overflow-hidden">
                <div className="h-full bg-grape transition-all duration-300" style={{ width: `${shippingProgress}%` }} />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <span className="mx-auto w-16 h-16 rounded-2xl bg-sun border-2 border-ink flex items-center justify-center -rotate-6">
                  <ShoppingBag className="w-7 h-7" />
                </span>
                <h3 className="font-display text-2xl font-extrabold">Tu bolsa está vacía</h3>
                <p className="text-sm text-ink/70 max-w-xs mx-auto">Elige tus próximos tenis y aparecerán aquí.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-ink text-white rounded-full font-extrabold hover:bg-grape transition-colors cursor-pointer"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-3xl border-2 border-ink bg-white">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-2xl border-2 border-ink shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-extrabold leading-tight truncate">{item.title}</h3>
                        <p className="text-xs text-ink/60">{item.colorName} · Talla {item.size}</p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="w-8 h-8 shrink-0 rounded-full hover:bg-bubble-soft flex items-center justify-center cursor-pointer"
                        aria-label={`Eliminar ${item.title} de la bolsa`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border-2 border-ink rounded-full">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center cursor-pointer"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-3.5 h-3.5" strokeWidth={3} />
                        </button>
                        <span className="w-5 text-center text-sm font-extrabold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center cursor-pointer"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                        </button>
                      </div>
                      <span className="font-display text-lg font-extrabold">{formatPrice((item.price * item.quantity))}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-5 border-t-2 border-ink bg-white space-y-4">
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-ink/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Código de descuento"
                      aria-label="Código de descuento"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-cream border-2 border-ink rounded-full focus:outline-hidden uppercase placeholder:normal-case"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-sun border-2 border-ink rounded-full text-sm font-extrabold hover:shadow-pop-sm transition-shadow cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>
                {couponSuccess && (
                  <p className="text-sm font-bold text-grape flex items-center gap-1" role="status">
                    <Check className="w-4 h-4" strokeWidth={3} /> {couponSuccess}
                  </p>
                )}
                {couponError && <p className="text-sm font-bold text-bubble" role="alert">{couponError}</p>}
              </form>

              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between font-bold text-grape">
                    <dt>Descuento (10%)</dt>
                    <dd>-{formatPrice(discountAmount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>Envío</dt>
                  <dd>{shippingCost === 0 ? <strong>GRATIS</strong> : formatPrice(shippingCost)}</dd>
                </div>
                <div className="flex justify-between font-display text-2xl font-extrabold pt-2 border-t-2 border-ink">
                  <dt>Total</dt>
                  <dd>{formatPrice(finalTotal)}</dd>
                </div>
              </dl>

              <button
                onClick={() => onCheckout(appliedCode)}
                className="w-full h-14 bg-lime border-2 border-ink rounded-full font-extrabold flex items-center justify-center gap-2 shadow-pop hover:shadow-pop-lg hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Ir a pagar
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-ink/60">
                <ShieldCheck className="w-4 h-4" />
                Pago seguro con PSE, Nequi o tarjeta
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
