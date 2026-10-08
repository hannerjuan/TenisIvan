import React, { useState } from 'react';
import { Lock, LogOut, Package, Receipt } from 'lucide-react';
import { ProductsAdmin } from './ProductsAdmin';
import { OrdersAdmin } from './OrdersAdmin';
import { adminApi } from './adminApi';

const TOKEN_KEY = 'tenisivan:admin-token';

const readToken = () => {
  try {
    return window.sessionStorage.getItem(TOKEN_KEY) ?? '';
  } catch {
    return '';
  }
};

/** Store owner area at /#admin: products, inventory and orders, behind ADMIN_TOKEN */
export const AdminPanel: React.FC = () => {
  const [token, setToken] = useState(readToken);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [tab, setTab] = useState<'products' | 'orders'>(() => (window.location.hash === '#pedidos' ? 'orders' : 'products'));

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError('');
    try {
      await adminApi.listProducts(password);
      try {
        window.sessionStorage.setItem(TOKEN_KEY, password);
      } catch {
        // Without session storage the password is simply asked again on reload
      }
      setToken(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo entrar.');
    } finally {
      setChecking(false);
    }
  };

  const logout = () => {
    try {
      window.sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      // nothing stored
    }
    setToken('');
    setPassword('');
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <form onSubmit={login} className="p-8 bg-white border-2 border-ink rounded-[2rem] shadow-pop-lg space-y-4">
          <h1 className="font-display text-4xl font-extrabold flex items-center gap-2">
            <Lock className="w-8 h-8" /> Administrar
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
            disabled={checking}
            className="w-full h-12 bg-ink text-white rounded-full font-extrabold hover:bg-grape transition-colors cursor-pointer disabled:opacity-60"
          >
            {checking ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  const tabClass = (active: boolean) =>
    `inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-ink font-extrabold cursor-pointer ${active ? 'bg-ink text-white' : 'bg-white hover:bg-cream'}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-5xl font-extrabold">Administrar tienda</h1>
        <button onClick={logout} className="inline-flex items-center gap-2 font-bold underline underline-offset-4 hover:text-grape cursor-pointer">
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </div>
      <div className="flex gap-2" role="tablist">
        <button role="tab" aria-selected={tab === 'products'} onClick={() => setTab('products')} className={tabClass(tab === 'products')}>
          <Package className="w-4 h-4" /> Productos e inventario
        </button>
        <button role="tab" aria-selected={tab === 'orders'} onClick={() => setTab('orders')} className={tabClass(tab === 'orders')}>
          <Receipt className="w-4 h-4" /> Pedidos
        </button>
      </div>
      {tab === 'products' ? <ProductsAdmin token={token} /> : <OrdersAdmin token={token} />}
    </div>
  );
};
