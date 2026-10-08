import React, { useEffect, useState } from 'react';
import { ActiveTab, Product } from './types';
import { PRODUCTS_CATALOG, BRAND_INFO } from './data/catalog';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { Home, Grid, Heart, ShoppingBag } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentProduct, setCurrentProduct] = useState<Product>(PRODUCTS_CATALOG[0]);
  
  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Favorites / Wishlist state
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Checkout Modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTotals, setCheckoutTotals] = useState({
    subtotal: 0,
    discountAmount: 0,
    shippingCost: 0
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Close the topmost overlay with Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isCheckoutOpen) return; // the checkout resets its own step through its close button
      setIsCartOpen(false);
      setIsWishlistOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCheckoutOpen]);

  // Cart operations
  const handleAddToCart = (product: Product, size: string, colorName: string, image: string) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product.id && item.size === size && item.colorName === colorName);
      if (existingIndex > -1) {
        return prev.map((item, i) => i === existingIndex ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: product.id,
          title: product.title,
          price: product.price,
          image,
          colorName,
          size,
          quantity: 1
        }
      ];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => 
      prev
        .map(item => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Direct Buy Now (1 click buy)
  const handleDirectBuyNow = (product: Product, size: string, colorName: string, image: string) => {
    handleAddToCart(product, size, colorName, image);
    // The order covers the whole bag, so the total must include what was already in it
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + product.price;
    const shippingCost = subtotal >= BRAND_INFO.freeShippingFrom ? 0 : BRAND_INFO.shippingCost;
    setCheckoutTotals({
      subtotal,
      discountAmount: 0,
      shippingCost
    });
    setIsCheckoutOpen(true);
  };

  // Trigger checkout from Cart Drawer
  const handleStartCheckoutFromCart = (subtotal: number, discountAmount: number, shippingCost: number) => {
    setCheckoutTotals({ subtotal, discountAmount, shippingCost });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCompleteOrder = () => {
    setCartItems([]);
  };

  // Wishlist toggle
  const handleToggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(p => p.id !== id));
  };

  // Navigation handlers
  const handleSelectProduct = (product: Product) => {
    setCurrentProduct(product);
    setActiveTab('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCategory = (cat: string) => {
    setCategoryFilter(cat);
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim() && activeTab !== 'catalog') {
      setActiveTab('catalog');
    }
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isCurrentProductFavorite = favorites.some(p => p.id === currentProduct.id);

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink pb-20 lg:pb-0">
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        categoryFilter={categoryFilter}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategoryFilter={handleNavigateToCategory}
        cartCount={cartTotalCount}
        wishlistCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            onSelectProduct={handleSelectProduct}
            onNavigateToCategory={handleNavigateToCategory}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogView
            onSelectProduct={handleSelectProduct}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'pdp' && (
          <ProductDetailView
            currentProduct={currentProduct}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onDirectBuyNow={handleDirectBuyNow}
            isFavorite={isCurrentProductFavorite}
            onToggleFavorite={handleToggleFavorite}
            onBackToCatalog={() => setActiveTab('catalog')}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleStartCheckoutFromCart}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onSelectProduct={handleSelectProduct}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems.length > 0 ? cartItems : [{
          id: 'temp-1',
          productId: currentProduct.id,
          title: currentProduct.title,
          price: currentProduct.price,
          image: currentProduct.heroImage,
          colorName: currentProduct.colors[0]?.name || 'Estándar',
          size: currentProduct.sizes[0]?.size || 'M',
          quantity: 1
        }]}
        subtotal={checkoutTotals.subtotal}
        discountAmount={checkoutTotals.discountAmount}
        shippingCost={checkoutTotals.shippingCost}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Mobile bottom navigation */}
      <nav aria-label="Navegación móvil" className="lg:hidden fixed bottom-3 inset-x-3 z-40 bg-ink text-white rounded-full border-2 border-ink shadow-pop px-2 py-1.5 flex items-center justify-around">
        {[
          { label: 'Inicio', icon: Home, active: activeTab === 'home', onClick: () => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
          { label: 'Catálogo', icon: Grid, active: activeTab === 'catalog', onClick: () => handleNavigateToCategory('all') },
          { label: 'Favoritos', icon: Heart, active: isWishlistOpen, badge: favorites.length, onClick: () => setIsWishlistOpen(true) },
          { label: 'Bolsa', icon: ShoppingBag, active: isCartOpen, badge: cartTotalCount, onClick: () => setIsCartOpen(true) }
        ].map(({ label, icon: Icon, active, badge, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
              active ? 'bg-lime text-ink' : 'text-white/80'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
            {!!badge && (
              <span className="absolute top-0 right-2 min-w-4.5 h-4.5 px-1 bg-bubble text-white rounded-full text-[10px] font-extrabold flex items-center justify-center">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <Footer onSelectCategory={handleNavigateToCategory} />
    </div>
  );
}
