import React, { useEffect, useState } from 'react';
import { X, Check, MessageCircle, ExternalLink } from 'lucide-react';
import { CartItem } from './CartDrawer';
import { formatPrice } from '../utils/format';
import { calculateTotals } from '../utils/pricing';
import { buildOrderMessage, whatsappUrl } from '../utils/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  couponCode: string;
  onCompleteOrder: () => void;
}

/** Collects the delivery details and hands the order to WhatsApp, where payment is agreed with the store */
export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  couponCode,
  onCompleteOrder
}) => {
  const [step, setStep] = useState<'details' | 'sent'>('details');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });
  const [sentUrl, setSentUrl] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setStep('details');
      onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { total, shippingCost } = calculateTotals(items, couponCode);
  const pairCount = items.reduce((acc, i) => acc + i.quantity, 0);

  // Reset to the first step so a new purchase never reopens on the sent screen
  const handleClose = () => {
    setStep('details');
    onClose();
  };

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const url = whatsappUrl(buildOrderMessage(items, couponCode, formData));
    window.open(url, '_blank', 'noopener');
    setSentUrl(url);
    setStep('sent');
    onCompleteOrder();
  };

  const inputClass = 'w-full px-4 py-2.5 bg-white border-2 border-ink rounded-2xl focus:outline-hidden focus:shadow-pop-sm';

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
            <MessageCircle className="w-5 h-5 text-lime" />
            <h3 id="checkout-title" className="font-display text-xl font-extrabold">
              {step === 'details' ? 'Termina tu pedido por WhatsApp' : '¡Pedido enviado!'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            aria-label="Cerrar checkout"
            className="w-10 h-10 rounded-full bg-white text-ink border-2 border-ink flex items-center justify-center hover:rotate-90 transition-transform cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {step === 'details' && (
            <form onSubmit={handleSendOrder} className="space-y-4 text-sm">
              <div className="p-4 bg-white border-2 border-ink rounded-2xl flex flex-wrap gap-2 items-center justify-between">
                <span>Total: <strong>{formatPrice(total)}</strong> ({pairCount} {pairCount === 1 ? 'par' : 'pares'})</span>
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
                    className={inputClass}
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
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Ciudad *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    placeholder="Ej. Manizales"
                    autoComplete="address-level2"
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={inputClass}
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
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">Notas (opcional)</label>
                  <input
                    type="text"
                    value={formData.notes}
                    placeholder="Ej. horario de entrega, forma de pago preferida..."
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <p className="p-4 bg-white border-2 border-ink rounded-2xl">
                Te abriremos <strong>WhatsApp</strong> con el resumen de tu pedido. Envíalo y acordamos contigo el pago y la entrega.
              </p>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-lime border-2 border-ink font-extrabold rounded-full flex items-center gap-2 shadow-pop hover:shadow-pop-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar pedido por WhatsApp
                </button>
              </div>
            </form>
          )}

          {step === 'sent' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-lime border-2 border-ink shadow-pop mx-auto flex items-center justify-center -rotate-6">
                <Check className="w-10 h-10" strokeWidth={3} />
              </div>

              <div className="space-y-1">
                <h4 className="font-display text-3xl font-extrabold">
                  ¡Gracias, {formData.name.split(' ')[0]}!
                </h4>
                <p className="text-sm text-ink/60">
                  Envía el mensaje en WhatsApp y te respondemos para confirmar el pago y la entrega.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={sentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-lime border-2 border-ink font-extrabold rounded-full inline-flex items-center gap-2 shadow-pop hover:shadow-pop-lg transition-all"
                >
                  ¿No se abrió? Abrir WhatsApp
                  <ExternalLink className="w-4 h-4" />
                </a>
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
