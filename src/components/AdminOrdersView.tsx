import React, { useState } from 'react';
import { Lock, RefreshCw } from 'lucide-react';
import { formatPrice } from '../utils/format';

interface AdminOrder {
  reference: string;
  createdAt: string;
  status: string;
  customer: { fullName: string; email: string; phone: string; address: string; city: string; postalCode: string };
  lines: { title: string; size: string; colorName: string; quantity: number }[];
  totals: { total: number };
  paymentMethod?: string;
}

const STATUS_STYLES: Record<string, { label: string; bg: string }> = {
  APPROVED: { label: 'Pagado', bg: 'bg-lime' },
  PENDING: { label: 'Pendiente', bg: 'bg-sun' },
  DECLINED: { label: 'Rechazado', bg: 'bg-bubble-soft' },
  VOIDED: { label: 'Anulado', bg: 'bg-bubble-soft' },
  ERROR: { label: 'Revisar', bg: 'bg-bubble text-white' }
};

/** Private orders page at /#pedidos, protected by the ADMIN_TOKEN environment variable */
export const AdminOrdersView: React.FC = () => {
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadOrders = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/orders', { headers: { Authorization: `Bearer ${password}` } });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? 'No se pudieron cargar los pedidos.');
      setOrders(body.orders);
    } catch (err) {
      setOrders(null);
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los pedidos.');
    } finally {
      setLoading(false);
    }
  };

  if (!orders) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <form onSubmit={loadOrders} className="p-8 bg-white border-2 border-ink rounded-[2rem] shadow-pop-lg space-y-4">
          <h1 className="font-display text-4xl font-extrabold flex items-center gap-2">
            <Lock className="w-8 h-8" /> Pedidos
          </h1>
          <label className="block space-y-1.5">
            <span className="text-sm font-bold">Contraseña de administración</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-cream border-2 border-ink rounded-2xl focus:outline-hidden focus:shadow-pop-sm"
            />
          </label>
          {error && <p className="font-bold text-bubble" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-ink text-white rounded-full font-extrabold hover:bg-grape transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Cargando...' : 'Ver pedidos'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-5xl font-extrabold">Pedidos ({orders.length})</h1>
        <button
          onClick={() => loadOrders()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-ink rounded-full font-extrabold hover:shadow-pop-sm cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="p-8 bg-white border-2 border-ink rounded-3xl text-center font-bold">Todavía no hay pedidos.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_STYLES[order.status] ?? STATUS_STYLES.ERROR;
            return (
              <article key={order.reference} className="p-5 bg-white border-2 border-ink rounded-3xl grid gap-4 md:grid-cols-[1fr_1fr_auto]">
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
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
