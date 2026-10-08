import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Truck, ShoppingBag, Tag, Check } from 'lucide-react';

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
  onCheckout: (subtotal: number, discountAmount: number, shippingCost: number) => void;
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
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 49.00;
  const difference = freeShippingThreshold - subtotal;
  const shippingCost = difference <= 0 ? 0 : 4.95;
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const discountAmount = subtotal * appliedDiscount;
  const finalTotal = subtotal - discountAmount + shippingCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'BIENVENIDA10' || code === 'NOMAD10') {
      setAppliedDiscount(0.10);
      setCouponSuccess('¡Código aplicado! 10% de descuento');
    } else {
      setCouponError('Código no válido. Prueba con BIENVENIDA10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="font-display font-semibold text-stone-900 text-lg">
                Tu Bolsa de Compra ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
              aria-label="Cerrar bolsa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping bar */}
          <div className="p-4 bg-stone-100/80 border-b border-stone-200">
            <div className="flex items-center justify-between text-xs font-medium text-stone-800 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                {difference <= 0 ? (
                  <span className="text-emerald-700 font-semibold">¡Enhorabuena! Tienes Envío Express GRATIS</span>
                ) : (
                  <span>
                    Te faltan <strong className="text-stone-900">${difference.toFixed(2)}</strong> para <strong>Envío Gratis</strong>
                  </span>
                )}
              </span>
              <span>{shippingProgress}%</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${difference <= 0 ? 'bg-emerald-600' : 'bg-stone-900'}`}
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Item list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-display font-medium text-stone-800 text-base">
                  Tu bolsa está vacía
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Añade tus prendas y zapatillas favoritas de nuestro catálogo para comenzar tu pedido.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-lg border border-stone-200/80 bg-white hover:border-stone-300 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-24 object-cover rounded-md bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 leading-snug line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                        <span>Color: {item.colorName}</span>
                        <span>·</span>
                        <span className="font-medium text-stone-800">Talla: {item.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-stone-600 hover:text-stone-900 font-bold cursor-pointer"
                          aria-label="Disminuir"
                        >
                          -
                        </button>
                        <span className="px-2 font-medium text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-stone-600 hover:text-stone-900 font-bold cursor-pointer"
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs font-semibold text-stone-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Código dto. (ej. BIENVENIDA10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>
                {couponSuccess && (
                  <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                    <Check className="w-3 h-3" /> {couponSuccess}
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 font-medium">
                    {couponError}
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Descuento aplicado (10%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Envío express</span>
                  <span>{difference <= 0 ? <strong className="text-emerald-700">GRATIS</strong> : '$4.95'}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-semibold text-sm pt-2 border-t border-stone-200">
                  <span>Total final (IVA incl.)</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Installments microcopy */}
              <p className="text-[11px] text-stone-500 text-center">
                O paga en <strong>3 cuotas de ${(finalTotal / 3).toFixed(2)}</strong> sin intereses con Klarna.
              </p>

              <button
                onClick={() => onCheckout(subtotal, discountAmount, shippingCost)}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs tracking-wide rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                Tramitar Pedido Seguro
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pago 100% encriptado SSL · Devoluciones fáciles en 30 días</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
