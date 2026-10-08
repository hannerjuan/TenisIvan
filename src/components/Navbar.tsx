import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { SNEAKER_STYLES, BRAND_INFO } from '../data/catalog';
import { ShoppingBag, Search, Menu, X, Heart, Zap } from 'lucide-react';
import { Logo } from './Logo';
import { formatPrice } from '../utils/format';

interface NavbarProps {
  activeTab: ActiveTab;
  categoryFilter: string;
  onSelectTab: (tab: ActiveTab) => void;
  onSelectCategoryFilter: (cat: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const ANNOUNCEMENTS = [
  `Envío gratis desde ${formatPrice(BRAND_INFO.freeShippingFrom)}`,
  '30 días para cambiar de talla',
  `-10% en tu primer par con ${BRAND_INFO.welcomeCode}`,
  'Paga en 3 cuotas sin intereses'
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  categoryFilter,
  onSelectTab,
  onSelectCategoryFilter,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  searchQuery,
  onSearchChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const goToCategory = (slug: string) => {
    onSelectCategoryFilter(slug);
    setMobileMenuOpen(false);
  };

  const isActiveCategory = (slug: string) => activeTab === 'catalog' && categoryFilter === slug;

  const searchInput = (className: string) => (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/50" />
      <input
        type="search"
        placeholder="Busca tus tenis..."
        aria-label="Buscar tenis"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 text-sm font-medium bg-white border-2 border-ink rounded-full placeholder:text-ink/40 focus:outline-hidden focus:shadow-pop-sm transition-shadow"
      />
    </div>
  );

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement marquee */}
      <div className="bg-ink text-lime text-xs font-bold overflow-hidden py-2" aria-label="Promociones">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((text, i) => (
                <span key={i} className="flex items-center gap-2 px-6 whitespace-nowrap">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-cream/90 backdrop-blur-md border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full border-2 border-ink bg-white flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button onClick={() => onSelectTab('home')} className="shrink-0 cursor-pointer" aria-label="TenisIvan, ir al inicio">
              <Logo />
            </button>

            <nav className="hidden lg:flex items-center gap-1.5 text-sm font-bold whitespace-nowrap" aria-label="Estilos">
              {SNEAKER_STYLES.map((style) => (
                <button
                  key={style.slug}
                  onClick={() => goToCategory(style.slug)}
                  className={`px-3.5 py-2 rounded-full border-2 transition-all cursor-pointer ${
                    isActiveCategory(style.slug)
                      ? 'border-ink shadow-pop-sm'
                      : 'border-transparent hover:border-ink'
                  }`}
                  style={isActiveCategory(style.slug) ? { backgroundColor: style.color } : undefined}
                >
                  {style.name}
                </button>
              ))}
              <button
                onClick={() => goToCategory('all')}
                className={`px-3.5 py-2 rounded-full border-2 transition-all cursor-pointer ${
                  isActiveCategory('all') ? 'bg-ink text-white border-ink' : 'border-transparent hover:border-ink'
                }`}
              >
                Ver todo
              </button>
            </nav>

            <div className="flex items-center gap-2">
              {searchInput('hidden md:block w-52 xl:w-64')}

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden w-10 h-10 rounded-full border-2 border-ink bg-white flex items-center justify-center cursor-pointer"
                aria-label="Buscar"
                aria-expanded={searchOpen}
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={onOpenWishlist}
                className="relative w-10 h-10 rounded-full border-2 border-ink bg-white hover:bg-bubble-soft hidden sm:flex items-center justify-center transition-colors cursor-pointer"
                aria-label={`Ver favoritos (${wishlistCount})`}
              >
                <Heart className="w-4.5 h-4.5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-bubble text-white border-2 border-ink text-[10px] font-extrabold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={onOpenCart}
                className="relative h-10 pl-3 pr-4 rounded-full border-2 border-ink bg-lime shadow-pop-sm hover:shadow-pop hover:-translate-y-0.5 flex items-center gap-2 text-sm font-extrabold transition-all cursor-pointer"
                aria-label={`Ver bolsa de compras (${cartCount})`}
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <span className="hidden sm:inline">Bolsa</span>
                <span className="min-w-5 h-5 px-1 rounded-full bg-ink text-lime text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {searchOpen && <div className="md:hidden pb-3">{searchInput('w-full')}</div>}
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden border-t-2 border-ink bg-cream px-4 py-4 grid grid-cols-2 gap-2" aria-label="Estilos">
            {SNEAKER_STYLES.map((style) => (
              <button
                key={style.slug}
                onClick={() => goToCategory(style.slug)}
                className="text-left px-4 py-3 rounded-2xl border-2 border-ink shadow-pop-sm font-display text-lg font-extrabold cursor-pointer"
                style={{ backgroundColor: style.color }}
              >
                {style.name}
              </button>
            ))}
            <button
              onClick={() => goToCategory('all')}
              className="text-left px-4 py-3 rounded-2xl border-2 border-ink shadow-pop-sm bg-ink text-white font-display text-lg font-extrabold cursor-pointer"
            >
              Ver todo
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
