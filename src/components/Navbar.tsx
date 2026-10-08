import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Heart,
  Truck,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onSelectCategoryFilter: (cat: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
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

  const handleNavCategory = (categorySlug: string) => {
    onSelectCategoryFilter(categorySlug);
    onSelectTab('catalog');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Announcement Bar */}
      <div className="bg-stone-900 text-stone-200 text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 overflow-hidden">
        <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          Envíos Express 24/48h gratis desde $49 · Devoluciones gratuitas en 30 días · Código: <strong className="text-white underline">BIENVENIDA10</strong> (10% DTO)
        </span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo */}
          <div 
            onClick={() => onSelectTab('home')}
            className="cursor-pointer select-none shrink-0"
          >
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-stone-950">
                NOMAD & CO.
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 hidden sm:inline">
                STUDIO
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-stone-600 -mt-0.5 hidden sm:block">
              Casual Wear & Urban Footwear
            </p>
          </div>

          {/* Desktop Navigation Category Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'home' ? 'text-stone-950 font-bold bg-stone-100' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Inicio
            </button>

            <button
              onClick={() => handleNavCategory('mujer')}
              className="px-3 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Mujer
            </button>

            <button
              onClick={() => handleNavCategory('hombre')}
              className="px-3 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Hombre
            </button>

            <button
              onClick={() => handleNavCategory('calzado')}
              className="px-3 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Calzado Urbano</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            </button>

            <button
              onClick={() => handleNavCategory('drops')}
              className="px-3 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Drops & Cápsulas</span>
            </button>

            <button
              onClick={() => handleNavCategory('all')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'catalog' ? 'text-stone-950 font-bold bg-stone-100' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Catálogo Completo
            </button>
          </nav>

          {/* Right Action Icons (Search + Wishlist + Bag) */}
          <div className="flex items-center gap-2">
            {/* Search input desktop */}
            <div className="relative hidden md:block w-48 lg:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar prenda, zapatilla..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-100 border border-transparent rounded-lg focus:bg-white focus:border-stone-400 focus:outline-hidden transition-all text-stone-800"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 cursor-pointer"
              aria-label="Buscar"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Ver favoritos"
              title="Favoritos"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold absolute top-1 right-1 flex items-center justify-center animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-stone-800 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              aria-label="Ver bolsa de compras"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-semibold hidden sm:inline">Bolsa</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-stone-950 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input dropdown */}
        {searchOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-stone-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar prenda o calzado..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-100 border border-transparent rounded-lg focus:bg-white focus:border-stone-400 focus:outline-hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <button
            onClick={() => { onSelectTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === 'home' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            Inicio
          </button>

          <button
            onClick={() => handleNavCategory('mujer')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100"
          >
            Colección Mujer
          </button>

          <button
            onClick={() => handleNavCategory('hombre')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100"
          >
            Colección Hombre
          </button>

          <button
            onClick={() => handleNavCategory('calzado')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100"
          >
            Calzado Urbano & Sneakers
          </button>

          <button
            onClick={() => handleNavCategory('drops')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100"
          >
            Drops & Básicos Heavyweight
          </button>

          <button
            onClick={() => handleNavCategory('all')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100"
          >
            Ver Todo el Catálogo
          </button>
        </div>
      )}
    </header>
  );
};
