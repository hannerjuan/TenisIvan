import React, { useEffect, useState } from 'react';
import { ActiveTab, Product } from './types';
import { PRODUCTS_CATALOG } from './data/fashionData';
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
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      productId: PRODUCTS_CATALOG[2].id,
      title: PRODUCTS_CATALOG[2].title,
      price: PRODUCTS_CATALOG[2].price,
      image: PRODUCTS_CATALOG[2].heroImage,
      colorName: 'Blanco Tiza & Verde',
      size: '42 EU',
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Favorites / Wishlist state
  const [favorites, setFavorites] = useState<Product[]>([
    PRODUCTS_CATALOG[0],
    PRODUCTS_CATALOG[1]
  ]);
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
    const shippingCost = subtotal >= 49 ? 0 : 4.95;
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
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-stone-900 selection:bg-stone-900 selection:text-white pb-16 lg:pb-0">
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSelectCategoryFilter={(cat) => {
          setCategoryFilter(cat);
          setActiveTab('catalog');
        }}
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
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogView
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
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
        onAddToCart={handleAddToCart}
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

      {/* Mobile Bottom Navigation Bar (High Converting Thumb Zone) */}
      <nav aria-label="Navegación móvil" className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-2 px-6 flex items-center justify-around text-xs shadow-lg">
        <button
          onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'home' ? 'text-stone-950 font-bold' : 'text-stone-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Inicio</span>
        </button>

        <button
          onClick={() => { setActiveTab('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'catalog' ? 'text-stone-950 font-bold' : 'text-stone-500'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px]">Catálogo</span>
        </button>

        <button
          onClick={() => setIsWishlistOpen(true)}
          className="flex flex-col items-center gap-1 text-stone-500 cursor-pointer relative"
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px]">Favoritos</span>
          {favorites.length > 0 && (
            <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 text-stone-500 cursor-pointer relative"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px]">Bolsa</span>
          {cartTotalCount > 0 && (
            <span className="absolute -top-1 right-1 w-3.5 h-3.5 bg-stone-950 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {cartTotalCount}
            </span>
          )}
        </button>
      </nav>

      {/* Footer */}
      <Footer onSelectCategory={handleNavigateToCategory} />
    </div>
  );
}
