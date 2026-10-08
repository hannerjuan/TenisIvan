import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import { adminApi } from './adminApi';

interface AdminOrder {
  reference: string;
  createdAt: string;
  status: string;
  customer: { fullName: string; email: string; phone: string; address: string; city: string; postalCode: string };
  lines: { title: string; size: string; colorName: string; quantity: number }[];
  totals: { total: number };
  paymentMethod?: string;
  stockIssue?: string;
}

const STATUS_STYLES: Record<string, { label: string; bg: string }> = {
  APPROVED: { label: 'Pagado', bg: 'bg-lime' },
  PENDING: { label: 'Pendiente', bg: 'bg-sun' },
  DECLINED: { label: 'Rechazado', bg: 'bg-bubble-soft' },
  VOIDED: { label: 'Anulado', bg: 'bg-bubble-soft' },
  ERROR: { label: 'Revisar', bg: 'bg-bubble text-white' }
};

export const OrdersAdmin: React.FC<{ token: string }> = ({ token }) => {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setOrders((await adminApi.listOrders<AdminOrder>(token)).orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-3xl font-extrabold">Pedidos {orders && `(${orders.length})`}</h2>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-ink rounded-full font-extrabold hover:shadow-pop-sm cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar
        </button>
      </div>

      {error && <p className="p-4 bg-bubble-soft border-2 border-ink rounded-2xl font-bold" role="alert">{error}</p>}

      {orders?.length === 0 && (
        <p className="p-8 bg-white border-2 border-ink rounded-3xl text-center font-bold">Todavía no hay pedidos.</p>
      )}

      <div className="space-y-4">
        {orders?.map((order) => {
          const status = STATUS_STYLES[order.status] ?? STATUS_STYLES.ERROR;
          return (
            <article key={order.reference} className="p-5 bg-white border-2 border-ink rounded-3xl space-y-3">
              {order.stockIssue && (
                <p className="flex items-start gap-2 p-3 bg-bubble-soft border-2 border-ink rounded-2xl text-sm font-bold">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  Se pagó pero no quedaba stock de: {order.stockIssue}. Contacta al cliente.
                </p>
              )}
              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                <div className="space-y-1">
                  <p className="font-mono text-sm font-bold">{order.reference}</p>
                  <p className="text-sm text-ink/60">{new Date(order.createdAt).toLocaleString('es-CO')}</p>
                  <ul className="pt-2 text-sm space-y-0.5">
                    {order.lines.map((line, i) => (
                      <li key={i}>
                        <strong>{line.quantity}×</strong> {line.title} · talla {line.size} · {line.colorName}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm space-y-0.5">
                  <p className="font-bold">{order.customer.fullName}</p>
                  <p>{order.customer.email} · {order.customer.phone}</p>
                  <p>{order.customer.address}</p>
                  <p>{order.customer.city} · {order.customer.postalCode}</p>
                </div>
                <div className="flex md:flex-col items-center md:items-end justify-between gap-2">
                  <span className={`px-3 py-1 rounded-full border-2 border-ink text-sm font-extrabold ${status.bg}`}>{status.label}</span>
                  <span className="font-display text-2xl font-extrabold">{formatPrice(order.totals.total)}</span>
                  {order.paymentMethod && <span className="text-xs text-ink/60">{order.paymentMethod}</span>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
