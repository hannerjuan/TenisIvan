import React from 'react';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (id: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  const openProduct = (product: Product) => {
    onSelectProduct(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div role="dialog" aria-modal="true" aria-label="Favoritos" className="w-screen max-w-md bg-cream border-l-2 border-ink flex flex-col">
          <div className="px-5 py-4 border-b-2 border-ink bg-bubble text-white flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold flex items-center gap-2">
              <Heart className="w-6 h-6 fill-current" />
              Favoritos ({favorites.length})
            </h2>
            <button
              onClick={onClose}
              aria-label="Cerrar favoritos"
              className="w-10 h-10 rounded-full bg-white text-ink border-2 border-ink flex items-center justify-center hover:rotate-90 transition-transform cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {favorites.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <span className="mx-auto w-16 h-16 rounded-2xl bg-bubble-soft border-2 border-ink flex items-center justify-center rotate-6">
                  <Heart className="w-7 h-7" />
                </span>
                <h3 className="font-display text-2xl font-extrabold">Aún no tienes favoritos</h3>
                <p className="text-sm text-ink/70 max-w-xs mx-auto">
                  Toca el corazón de cualquier par para guardarlo y comprarlo después.
                </p>
              </div>
            ) : (
              favorites.map((product) => (
                <div key={product.id} className="flex gap-3 p-3 rounded-3xl border-2 border-ink bg-white">
                  <button
                    onClick={() => openProduct(product)}
                    className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 border-ink cursor-pointer"
                    style={{ backgroundColor: product.cardColor }}
                    aria-label={`Ver ${product.title}`}
                  >
                    <img src={product.heroImage} alt="" className="w-full h-full object-cover" />
                  </button>
                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-extrabold leading-tight truncate">{product.title}</h3>
                        <p className="text-sm font-bold">${product.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => onRemoveFavorite(product.id)}
                        className="w-8 h-8 shrink-0 rounded-full hover:bg-bubble-soft flex items-center justify-center cursor-pointer"
                        aria-label={`Quitar ${product.title} de favoritos`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => openProduct(product)}
                      className="self-start inline-flex items-center gap-1.5 px-4 py-2 bg-ink text-white rounded-full text-sm font-extrabold hover:bg-grape transition-colors cursor-pointer"
                    >
                      Elegir talla
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
