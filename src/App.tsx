import React, { useEffect, useState } from 'react';
import { ActiveTab, Product, ProductColor } from './types';
import { useCatalog } from './context/CatalogContext';
import { unitsFor } from './utils/inventory';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { PaymentResultModal } from './components/PaymentResultModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { fetchPaymentResult, isLivePayments, PaymentResult } from './utils/payments';
import { loadJSON, saveJSON } from './utils/storage';
import { Home, Grid, Heart, ShoppingBag } from 'lucide-react';

const CART_KEY = 'tenisivan:cart';
const FAVORITES_KEY = 'tenisivan:favorites';
const ADMIN_HASHES = ['#admin', '#pedidos'];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { products, status: catalogStatus } = useCatalog();
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const currentProduct = products.find((p) => p.id === currentProductId) ?? null;

  // Persisted so the bag survives the round trip to the payment gateway
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadJSON<CartItem[]>(CART_KEY, []).filter((item) => item && item.productId && item.colorId)
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Favorites / Wishlist state
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadJSON<string[]>(FAVORITES_KEY, []));
  const favorites = favoriteIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Checkout Modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutCoupon, setCheckoutCoupon] = useState('');

  // Result of a real payment, shown when Wompi sends the customer back with ?id=<transaction>
  const [paymentTransactionId] = useState(() =>
    isLivePayments ? new URLSearchParams(window.location.search).get('id') : null
  );
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [paymentError, setPaymentError] = useState('');
  const [isPaymentResultOpen, setIsPaymentResultOpen] = useState(Boolean(paymentTransactionId));

  const [isAdminView, setIsAdminView] = useState(() => ADMIN_HASHES.includes(window.location.hash));

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => saveJSON(CART_KEY, cartItems), [cartItems]);
  useEffect(() => saveJSON(FAVORITES_KEY, favoriteIds), [favoriteIds]);

  // Once the catalog loads, refresh bag prices and drop pairs that are gone or out of stock
  useEffect(() => {
    if (catalogStatus !== 'ready' && catalogStatus !== 'sample') return;
    setCartItems((prev) =>
      prev.flatMap((item) => {
        const product = products.find((p) => p.id === item.productId);
        const units = product ? unitsFor(product, item.colorId, item.size) : 0;
        if (!product || units === 0) return [];
        return [{ ...item, title: product.title, price: product.price, quantity: Math.min(item.quantity, units) }];
      })
    );
  }, [products, catalogStatus]);

  useEffect(() => {
    const onHashChange = () => setIsAdminView(ADMIN_HASHES.includes(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (!paymentTransactionId) return;
    window.history.replaceState(null, '', window.location.pathname);
    fetchPaymentResult(paymentTransactionId)
      .then((result) => {
        setPaymentResult(result);
        if (result.status === 'APPROVED') setCartItems([]);
      })
      .catch((error: Error) => setPaymentError(error.message));
  }, [paymentTransactionId]);

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

  // Cart operations: quantities never go above the units in stock
  const stockFor = (productId: string, colorId: string, size: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? unitsFor(product, colorId, size) : 0;
  };

  const handleAddToCart = (product: Product, size: string, color: ProductColor, quantity = 1) => {
    const max = unitsFor(product, color.id, size);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id && item.size === size && item.colorId === color.id);
      if (existing) {
        return prev.map((item) => (item === existing ? { ...item, quantity: Math.min(max, item.quantity + quantity) } : item));
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: product.id,
          title: product.title,
          price: product.price,
          image: color.images[0] ?? '',
          colorId: color.id,
          colorName: color.name,
          size,
          quantity: Math.min(max, quantity)
        }
      ];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.flatMap((item) => {
        if (item.id !== id) return [item];
        const next = Math.min(item.quantity + delta, stockFor(item.productId, item.colorId, item.size));
        return next > 0 ? [{ ...item, quantity: next }] : [];
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Direct Buy Now (1 click buy)
  const handleDirectBuyNow = (product: Product, size: string, color: ProductColor) => {
    // The order covers the whole bag; the checkout totals it from the updated cart
    handleAddToCart(product, size, color);
    setCheckoutCoupon('');
    setIsCheckoutOpen(true);
  };

  // Trigger checkout from Cart Drawer
  const handleStartCheckoutFromCart = (couponCode: string) => {
    setCheckoutCoupon(couponCode);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCompleteOrder = () => {
    setCartItems([]);
  };

  // Wishlist toggle
  const handleToggleFavorite = (product: Product) => {
    setFavoriteIds((prev) => (prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]));
  };

  const handleRemoveFavorite = (id: string) => {
    setFavoriteIds((prev) => prev.filter((favoriteId) => favoriteId !== id));
  };

  // Navigation handlers
  const handleSelectProduct = (product: Product) => {
    leaveAdminView();
    setCurrentProductId(product.id);
    setActiveTab('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Any storefront navigation leaves the private orders page
  const leaveAdminView = () => {
    if (!isAdminView) return;
    window.history.replaceState(null, '', window.location.pathname);
    setIsAdminView(false);
  };

  const handleNavigateToCategory = (cat: string) => {
    leaveAdminView();
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
  const isCurrentProductFavorite = Boolean(currentProduct && favoriteIds.includes(currentProduct.id));

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink pb-20 lg:pb-0">
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        categoryFilter={categoryFilter}
        onSelectTab={(tab) => {
          leaveAdminView();
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
        {isAdminView && <AdminPanel />}

        {!isAdminView && activeTab === 'home' && (
          <HomeView
            onSelectProduct={handleSelectProduct}
            onNavigateToCategory={handleNavigateToCategory}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {!isAdminView && activeTab === 'catalog' && (
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

        {!isAdminView && activeTab === 'pdp' && currentProduct && (
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
        items={cartItems}
        couponCode={checkoutCoupon}
        onCompleteOrder={handleCompleteOrder}
      />

      {isPaymentResultOpen && (
        <PaymentResultModal result={paymentResult} error={paymentError} onClose={() => setIsPaymentResultOpen(false)} />
      )}

      {/* Mobile bottom navigation */}
      <nav aria-label="Navegación móvil" className="lg:hidden fixed bottom-3 inset-x-3 z-40 bg-ink text-white rounded-full border-2 border-ink shadow-pop px-2 py-1.5 flex items-center justify-around">
        {[
          { label: 'Inicio', icon: Home, active: activeTab === 'home', onClick: () => { leaveAdminView(); setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
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
