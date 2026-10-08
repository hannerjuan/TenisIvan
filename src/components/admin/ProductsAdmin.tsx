import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Pencil, Plus, Trash2, PackageOpen } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/format';
import { LOW_STOCK_THRESHOLD, mainImage, styleName, totalUnits, unitsFor } from '../../utils/inventory';
import { adminApi } from './adminApi';
import { ProductEditor } from './ProductEditor';

export const ProductsAdmin: React.FC<{ token: string }> = ({ token }) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    adminApi
      .listProducts(token)
      .then(({ products }) => setProducts(products))
      .catch((err: Error) => setError(err.message));
  }, [token]);

  const run = async (action: () => Promise<{ products: Product[] }>) => {
    setBusy(true);
    setError('');
    try {
      setProducts((await action()).products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo salió mal.');
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <ProductEditor
        token={token}
        product={editing === 'new' ? null : editing}
        onCancel={() => setEditing(null)}
        onSaved={(next) => {
          setProducts(next);
          setEditing(null);
          window.scrollTo({ top: 0 });
        }}
      />
    );
  }

  const lowStockCount = (p: Product) =>
    p.colors.reduce((acc, c) => acc + p.sizes.filter((s) => { const u = unitsFor(p, c.id, s); return u > 0 && u <= LOW_STOCK_THRESHOLD; }).length, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-3xl font-extrabold">Productos {products && `(${products.length})`}</h2>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-lime border-2 border-ink rounded-full font-extrabold shadow-pop-sm hover:shadow-pop cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={3} /> Nuevo producto
        </button>
      </div>

      {error && <p className="p-4 bg-bubble-soft border-2 border-ink rounded-2xl font-bold" role="alert">{error}</p>}
      {!products && !error && <p className="font-bold text-ink/60" role="status">Cargando productos...</p>}

      {products?.length === 0 && (
        <div className="p-8 bg-white border-2 border-ink rounded-3xl text-center space-y-4">
          <PackageOpen className="w-12 h-12 mx-auto" />
          <h3 className="font-display text-2xl font-extrabold">Tu catálogo está vacío</h3>
          <p className="text-ink/70 max-w-md mx-auto">
            Crea tu primer producto, o importa los 10 modelos de ejemplo como borradores ocultos para editarlos con tus fotos, precios e inventario.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => setEditing('new')} className="px-5 py-2.5 bg-lime border-2 border-ink rounded-full font-extrabold cursor-pointer">
              Crear producto
            </button>
            <button
              onClick={() => run(() => adminApi.importSample(token))}
              disabled={busy}
              className="px-5 py-2.5 bg-white border-2 border-ink rounded-full font-extrabold cursor-pointer disabled:opacity-60"
            >
              Importar ejemplos
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {products?.map((product) => {
          const units = totalUnits(product);
          const low = lowStockCount(product);
          return (
            <article key={product.id} className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-3 bg-white border-2 border-ink rounded-3xl">
              <span className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 border-ink" style={{ backgroundColor: product.cardColor }}>
                {mainImage(product) && <img src={mainImage(product)} alt="" className="w-full h-full object-cover" />}
              </span>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-extrabold truncate">{product.title}</h3>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border-2 border-ink ${product.published ? 'bg-lime' : 'bg-cream text-ink/60'}`}>
                    {product.published ? 'Publicado' : 'Oculto'}
                  </span>
                </div>
                <p className="text-sm text-ink/70">
                  {styleName(product.category)} · {product.targetGender} · {formatPrice(product.price)} · {product.colors.length}{' '}
                  {product.colors.length === 1 ? 'color' : 'colores'}
                </p>
                <p className="text-sm font-bold">
                  <span className={units === 0 ? 'text-bubble' : ''}>{units === 0 ? 'Sin stock' : `${units} pares`}</span>
                  {low > 0 && <span className="text-bubble"> · {low} {low === 1 ? 'talla con pocas unidades' : 'tallas con pocas unidades'}</span>}
                </p>
              </div>
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => run(() => adminApi.saveProduct(token, { ...product, published: !product.published }))}
                  disabled={busy}
                  className="w-10 h-10 rounded-full border-2 border-ink bg-white hover:bg-lime-soft flex items-center justify-center cursor-pointer disabled:opacity-50"
                  aria-label={product.published ? `Ocultar ${product.title}` : `Publicar ${product.title}`}
                  title={product.published ? 'Ocultar de la tienda' : 'Publicar en la tienda'}
                >
                  {product.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setEditing(product)}
                  className="w-10 h-10 rounded-full border-2 border-ink bg-white hover:bg-sun-soft flex items-center justify-center cursor-pointer"
                  aria-label={`Editar ${product.title}`}
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`¿Borrar ${product.title}? Esta acción no se puede deshacer.`)) {
                      run(() => adminApi.deleteProduct(token, product.id));
                    }
                  }}
                  disabled={busy}
                  className="w-10 h-10 rounded-full border-2 border-ink bg-white hover:bg-bubble-soft flex items-center justify-center cursor-pointer disabled:opacity-50"
                  aria-label={`Borrar ${product.title}`}
                  title="Borrar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
