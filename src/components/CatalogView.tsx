import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCTS_CATALOG } from '../data/fashionData';
import { Star, Filter, ArrowUpDown, Heart, ShoppingBag } from 'lucide-react';

interface CatalogViewProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, colorName: string, image: string) => void;
  searchQuery: string;
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  favorites: Product[];
  onToggleFavorite: (product: Product) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  onSelectProduct,
  onAddToCart,
  searchQuery,
  categoryFilter,
  onCategoryFilterChange,
  favorites,
  onToggleFavorite
}) => {
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');

  // Filter products
  const filteredProducts = PRODUCTS_CATALOG.filter((product) => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchSub = product.subcategory.toLowerCase().includes(q);
      const matchSpecs = product.technicalSpecs.materials.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchSub && !matchSpecs) return false;
    }

    // Category
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'drops') {
        if (!product.isNew && !product.badge?.includes('Drop') && !product.badge?.includes('Temporada')) {
          // If drops selected, show new or special
          if (product.category !== 'drops') return true;
        }
      } else if (product.category !== categoryFilter) {
        return false;
      }
    }

    // Gender
    if (selectedGender !== 'all' && product.targetGender !== selectedGender && product.targetGender !== 'Unisex') {
      return false;
    }

    // Size filter
    if (selectedSizeFilter !== 'all') {
      const hasSize = product.sizes.some(s => s.size === selectedSizeFilter && s.available);
      if (!hasSize) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const isFavorite = (id: string) => favorites.some(f => f.id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Catalog Title Banner */}
      <div className="border-b border-stone-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1">
            Colección Informal & Calzado
          </span>
          <h1 className="font-display text-3xl font-bold text-stone-900 tracking-tight">
            {categoryFilter === 'all' && 'Catálogo Completo'}
            {categoryFilter === 'mujer' && 'Colección Mujer'}
            {categoryFilter === 'hombre' && 'Colección Hombre'}
            {categoryFilter === 'calzado' && 'Calzado Urbano & Sneakers'}
            {categoryFilter === 'drops' && 'Drops & Ediciones Especiales'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Prendas informales contemporáneas diseñadas para personas de 16 a 40 años.
          </p>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category tabs */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => onCategoryFilterChange('all')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                categoryFilter === 'all' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todos ({PRODUCTS_CATALOG.length})
            </button>
            <button
              onClick={() => onCategoryFilterChange('mujer')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                categoryFilter === 'mujer' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Mujer
            </button>
            <button
              onClick={() => onCategoryFilterChange('hombre')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                categoryFilter === 'hombre' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Hombre
            </button>
            <button
              onClick={() => onCategoryFilterChange('calzado')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                categoryFilter === 'calzado' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Calzado
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Calificación</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Product Cards */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <Filter className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-display font-medium text-stone-800 text-base">
            No se encontraron prendas con esos filtros
          </h3>
          <p className="text-xs text-stone-500">
            Prueba a limpiar tu búsqueda o seleccionar otra categoría.
          </p>
          <button
            onClick={() => {
              onCategoryFilterChange('all');
              setSelectedGender('all');
              setSelectedSizeFilter('all');
            }}
            className="px-4 py-2 bg-stone-900 text-white text-xs rounded-lg font-medium cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            const discountPercent = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : null;
            const fav = isFavorite(product.id);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-stone-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div 
                  onClick={() => onSelectProduct(product)}
                  className="relative aspect-4/5 bg-stone-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.heroImage}
                    alt={product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Secondary image preview on hover */}
                  {product.galleryImages[1] && (
                    <img
                      src={product.galleryImages[1].url}
                      alt={product.title}
                      className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />
                  )}

                  {/* Favorite Heart Button directly on card */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(product);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer shadow-xs ${
                      fav 
                        ? 'bg-rose-50 text-rose-600' 
                        : 'bg-white/80 hover:bg-white text-stone-600 hover:text-stone-950'
                    }`}
                    title="Añadir a favoritos"
                  >
                    <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    {product.badge && (
                      <span className="text-[10px] font-bold text-stone-900 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
                        {product.badge}
                      </span>
                    )}
                    {discountPercent && (
                      <span className="text-[10px] font-bold text-white bg-rose-600 px-2 py-0.5 rounded shadow-xs">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Color Swatch Dots preview */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2 py-1 rounded-md shadow-xs">
                    {product.colors.map((c) => (
                      <span
                        key={c.id}
                        className="w-2.5 h-2.5 rounded-full border border-stone-300"
                        style={{ backgroundColor: c.colorHex }}
                        title={c.name}
                      />
                    ))}
                    <span className="text-[10px] text-stone-600 ml-1">
                      {product.colors.length} col.
                    </span>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                      <span>{product.subcategory}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.targetGender}</span>
                    </div>

                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="font-display font-semibold text-stone-900 text-sm hover:text-stone-700 transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.title}
                    </h3>

                    <p className="text-xs text-stone-500 line-clamp-1">
                      {product.subtitle}
                    </p>

                    <div className="flex items-center gap-1 text-[11px] text-amber-500 pt-0.5">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-semibold text-stone-800">{product.rating}</span>
                      <span className="text-stone-400">({product.reviewCount})</span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-bold text-stone-900 text-base">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-500 block">
                        3x ${(product.price / 3).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Ver Ficha
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
