import React from 'react';
import { Check, Clock, X, Loader2 } from 'lucide-react';
import { PaymentResult } from '../utils/payments';
import { formatPrice } from '../utils/format';

interface PaymentResultModalProps {
  result: PaymentResult | null;
  error: string;
  onClose: () => void;
}

const METHOD_NAMES: Record<string, string> = {
  PSE: 'PSE',
  NEQUI: 'Nequi',
  CARD: 'tarjeta',
  BANCOLOMBIA_TRANSFER: 'transferencia Bancolombia'
};

export const PaymentResultModal: React.FC<PaymentResultModalProps> = ({ result, error, onClose }) => {
  const loading = !result && !error;
  const approved = result?.status === 'APPROVED';
  const pending = result?.status === 'PENDING';

  const view = loading
    ? { icon: Loader2, bg: 'bg-white', title: 'Verificando tu pago...', text: 'Un momento, estamos consultando con Wompi.' }
    : approved
    ? { icon: Check, bg: 'bg-lime', title: '¡Pago aprobado!', text: 'Tu pedido está confirmado y lo prepararemos para enviarlo a tu dirección.' }
    : pending
    ? { icon: Clock, bg: 'bg-sun', title: 'Pago en proceso', text: 'Tu banco aún no confirma el pago. Cuando se apruebe prepararemos tu pedido; no hace falta que pagues de nuevo.' }
    : { icon: X, bg: 'bg-bubble-soft', title: 'El pago no se completó', text: error || 'No se realizó ningún cobro. Tu bolsa sigue guardada para que lo intentes de nuevo.' };

  const Icon = view.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-result-title"
        className="w-full max-w-md bg-cream rounded-[2rem] border-2 border-ink shadow-pop-lg p-8 text-center space-y-4"
      >
        <span className={`mx-auto w-20 h-20 rounded-full border-2 border-ink shadow-pop flex items-center justify-center -rotate-6 ${view.bg}`}>
          <Icon className={`w-10 h-10 ${loading ? 'animate-spin' : ''}`} strokeWidth={3} />
        </span>
        <h2 id="payment-result-title" className="font-display text-3xl font-extrabold">{view.title}</h2>
        <p className="text-ink/70">{view.text}</p>

        {result && (
          <dl className="p-4 bg-white border-2 border-ink rounded-2xl text-sm space-y-1.5 text-left">
            <div className="flex justify-between gap-3">
              <dt>Pedido</dt>
              <dd className="font-mono font-bold">{result.reference}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Total</dt>
              <dd className="font-bold">{formatPrice(result.total)}</dd>
            </div>
            {result.paymentMethod && (
              <div className="flex justify-between gap-3">
                <dt>Pagado con</dt>
                <dd className="font-bold">{METHOD_NAMES[result.paymentMethod] ?? result.paymentMethod}</dd>
              </div>
            )}
          </dl>
        )}

        {!loading && (
          <button
            onClick={onClose}
            className="px-6 py-3 bg-ink text-white rounded-full font-extrabold hover:bg-grape transition-colors cursor-pointer"
          >
            {approved ? 'Seguir comprando' : 'Volver a la tienda'}
          </button>
        )}
      </div>
    </div>
  );
};
