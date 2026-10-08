import React from 'react';
import { Heart, Star, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, isFavorite = false, onToggleFavorite }) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <article className="group relative flex flex-col bg-white rounded-3xl border-2 border-ink shadow-pop hover:shadow-pop-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200">
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="relative m-2.5 mb-0 aspect-square rounded-2xl overflow-hidden border-2 border-ink cursor-pointer text-left"
        style={{ backgroundColor: product.cardColor }}
        aria-label={`Ver ${product.title}`}
      >
        <img
          src={product.heroImage}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-500"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {product.badge && (
            <span className="text-[11px] font-extrabold uppercase tracking-wide bg-sun text-ink border-2 border-ink px-2 py-0.5 rounded-full shadow-pop-sm">
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="text-[11px] font-extrabold bg-bubble text-white border-2 border-ink px-2 py-0.5 rounded-full shadow-pop-sm">
              -{discountPercent}%
            </span>
          )}
        </div>
      </button>

      {onToggleFavorite && (
        <button
          type="button"
          onClick={() => onToggleFavorite(product)}
          className={`absolute top-5 right-5 w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center shadow-pop-sm transition-colors cursor-pointer ${
            isFavorite ? 'bg-bubble text-white' : 'bg-white text-ink hover:bg-bubble-soft'
          }`}
          aria-label={isFavorite ? `Quitar ${product.title} de favoritos` : `Añadir ${product.title} a favoritos`}
          aria-pressed={isFavorite}
        >
          <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      )}

      <div className="flex-1 flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="uppercase tracking-wider text-grape">{product.subcategory}</span>
          <span className="flex items-center gap-1 text-ink">
            <Star className="w-3.5 h-3.5 fill-sun text-ink" />
            {product.rating}
            <span className="font-medium text-ink/50">({product.reviewCount})</span>
          </span>
        </div>

        <h3 className="font-display text-xl font-extrabold leading-tight">
          <button type="button" onClick={() => onSelect(product)} className="text-left hover:text-grape transition-colors cursor-pointer">
            {product.title}
          </button>
        </h3>
        <p className="text-sm text-ink/60 line-clamp-2">{product.subtitle}</p>

        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-ink/40 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1" aria-label={`${product.colors.length} colores`}>
              {product.colors.map((c) => (
                <span key={c.id} className="w-3.5 h-3.5 rounded-full border-2 border-ink" style={{ backgroundColor: c.colorHex }} title={c.name} />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="w-11 h-11 shrink-0 rounded-full bg-ink text-lime flex items-center justify-center group-hover:bg-grape group-hover:text-white transition-colors cursor-pointer"
            aria-label={`Ver detalles de ${product.title}`}
          >
            <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
};
