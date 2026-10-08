import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCTS_CATALOG, SNEAKER_STYLES } from '../data/catalog';
import { SearchX, ArrowUpDown, Ruler } from 'lucide-react';
import { ProductCard } from './ProductCard';

interface CatalogViewProps {
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  favorites: Product[];
  onToggleFavorite: (product: Product) => void;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';
const GENDERS = ['all', 'Mujer', 'Hombre', 'Unisex'] as const;
const SIZE_OPTIONS = Array.from(new Set(PRODUCTS_CATALOG.flatMap((p) => p.sizes.map((s) => s.size))));

export const CatalogView: React.FC<CatalogViewProps> = ({
  onSelectProduct,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  favorites,
  onToggleFavorite
}) => {
  const [gender, setGender] = useState<(typeof GENDERS)[number]>('all');
  const [size, setSize] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const activeStyle = SNEAKER_STYLES.find((s) => s.slug === categoryFilter);
  const query = searchQuery.trim().toLowerCase();

  const products = PRODUCTS_CATALOG.filter((p) => {
    if (query && ![p.title, p.subtitle, p.subcategory].some((field) => field.toLowerCase().includes(query))) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    // Unisex pairs show up for everyone
    if (gender !== 'all' && p.targetGender !== gender && p.targetGender !== 'Unisex') return false;
    if (size !== 'all' && !p.sizes.some((s) => s.size === size && s.available)) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const resetFilters = () => {
    onCategoryFilterChange('all');
    onSearchChange('');
    setGender('all');
    setSize('all');
  };

  const chip = (active: boolean) =>
    `px-4 py-2 rounded-full border-2 border-ink text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
      active ? 'shadow-pop-sm -translate-y-0.5' : 'bg-white hover:bg-cream'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div
        className="rounded-[2rem] border-2 border-ink p-6 sm:p-10 shadow-pop-lg"
        style={{ backgroundColor: activeStyle?.color ?? 'var(--color-pool)' }}
      >
        <p className="text-sm font-extrabold uppercase tracking-wider">Catálogo TenisIvan</p>
        <h1 className="font-display text-5xl sm:text-6xl font-extrabold leading-none mt-1">
          {activeStyle ? activeStyle.name : 'Todos los tenis'}
        </h1>
        <p className="mt-3 text-base font-medium text-ink/75 max-w-xl">
          {activeStyle ? activeStyle.tagline : 'Running, urbanos, basket, retro y skate. Encuentra el par que va contigo.'}
        </p>
      </div>

      {/* Style chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filtrar por estilo">
        <button
          onClick={() => onCategoryFilterChange('all')}
          className={`${chip(categoryFilter === 'all')} ${categoryFilter === 'all' ? 'bg-ink text-white' : ''}`}
          aria-pressed={categoryFilter === 'all'}
        >
          Todos ({PRODUCTS_CATALOG.length})
        </button>
        {SNEAKER_STYLES.map((style) => {
          const active = categoryFilter === style.slug;
          return (
            <button
              key={style.slug}
              onClick={() => onCategoryFilterChange(style.slug)}
              className={chip(active)}
              style={active ? { backgroundColor: style.color } : undefined}
              aria-pressed={active}
            >
              {style.name}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-y-2 border-ink py-4">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por género">
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-bold border-2 transition-colors cursor-pointer ${
                gender === g ? 'bg-grape text-white border-ink' : 'border-transparent hover:border-ink'
              }`}
              aria-pressed={gender === g}
            >
              {g === 'all' ? 'Todos' : g}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 bg-white border-2 border-ink rounded-full pl-3.5 pr-2 py-1.5 text-sm font-bold">
            <Ruler className="w-4 h-4" />
            <span className="sr-only">Talla</span>
            <select value={size} onChange={(e) => setSize(e.target.value)} className="bg-transparent focus:outline-hidden cursor-pointer">
              <option value="all">Todas las tallas</option>
              {SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>Talla {s} COL</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 bg-white border-2 border-ink rounded-full pl-3.5 pr-2 py-1.5 text-sm font-bold">
            <ArrowUpDown className="w-4 h-4" />
            <span className="sr-only">Ordenar por</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="bg-transparent focus:outline-hidden cursor-pointer">
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor valorados</option>
            </select>
          </label>
          <span className="text-sm font-bold text-ink/60" aria-live="polite">
            {products.length} {products.length === 1 ? 'modelo' : 'modelos'}
          </span>
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white rounded-[2rem] border-2 border-ink shadow-pop space-y-4">
          <span className="mx-auto w-16 h-16 rounded-2xl bg-bubble-soft border-2 border-ink flex items-center justify-center rotate-6">
            <SearchX className="w-7 h-7" />
          </span>
          <h2 className="font-display text-3xl font-extrabold">Ups, no hay tenis así</h2>
          <p className="text-ink/70">Prueba con otra talla, otro estilo o limpia la búsqueda.</p>
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-lime border-2 border-ink rounded-full font-extrabold shadow-pop-sm hover:shadow-pop transition-shadow cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              isFavorite={favorites.some((f) => f.id === product.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
