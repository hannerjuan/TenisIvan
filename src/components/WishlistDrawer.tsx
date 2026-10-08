import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, colorName: string, image: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectProduct,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-current" />
              <h2 className="font-display font-semibold text-stone-900 text-base">
                Tus Favoritos ({favorites.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {favorites.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-display font-medium text-stone-800 text-sm">
                  Aún no tienes prendas guardadas
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Haz clic en el corazón de cualquier prenda para guardarla y comprarla después.
                </p>
              </div>
            ) : (
              favorites.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors bg-white"
                >
                  <img
                    src={product.heroImage}
                    alt={product.title}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="w-20 h-24 object-cover rounded-lg bg-stone-100 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 
                          onClick={() => {
                            onSelectProduct(product);
                            onClose();
                          }}
                          className="text-xs font-semibold text-stone-900 line-clamp-1 hover:text-stone-700 cursor-pointer"
                        >
                          {product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveFavorite(product.id)}
                          className="text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{product.subtitle}</p>
                      <p className="text-xs font-bold text-stone-900 mt-1">${product.price.toFixed(2)}</p>
                    </div>

                    <button
                      onClick={() => {
                        const defaultSize = product.sizes[0]?.size || 'M';
                        const defaultColor = product.colors[0];
                        onAddToCart(product, defaultSize, defaultColor.name, defaultColor.image);
                      }}
                      className="w-full py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Mover a la Bolsa
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
