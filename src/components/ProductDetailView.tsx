import React, { useEffect, useState } from 'react';
import { Product, ProductColor } from '../types';
import { BRAND_INFO } from '../data/catalog';
import { useCatalog } from '../context/CatalogContext';
import { Ruler, Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, Check, ChevronLeft, Zap, Minus, Plus } from 'lucide-react';
import { SizeGuideModal } from './SizeGuideModal';
import { formatPrice } from '../utils/format';
import { LOW_STOCK_THRESHOLD, isInStock, mainImage, styleName, unitsFor } from '../utils/inventory';

interface ProductDetailViewProps {
  currentProduct: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: ProductColor, quantity: number) => void;
  onDirectBuyNow: (product: Product, size: string, color: ProductColor) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onBackToCatalog: () => void;
}

const TABS = [
  { id: 'descripcion', label: 'Descripción' },
  { id: 'detalles', label: 'Detalles' }
] as const;

/** First colour with stock, and in it the size closest to a common 39 */
const defaultSelection = (product: Product) => {
  const color = product.colors.find((c) => product.sizes.some((s) => unitsFor(product, c.id, s) > 0)) ?? product.colors[0];
  const size = ['39', ...product.sizes].find((s) => product.sizes.includes(s) && unitsFor(product, color.id, s) > 0) ?? '';
  return { color, size };
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  currentProduct,
  onSelectProduct,
  onAddToCart,
  onDirectBuyNow,
  isFavorite,
  onToggleFavorite,
  onBackToCatalog
}) => {
  const { products } = useCatalog();
  const [selectedColor, setSelectedColor] = useState(() => defaultSelection(currentProduct).color);
  const [selectedSize, setSelectedSize] = useState(() => defaultSelection(currentProduct).size);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('descripcion');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    const { color, size } = defaultSelection(currentProduct);
    setSelectedColor(color);
    setSelectedSize(size);
    setActiveImageIndex(0);
    setQuantity(1);
  }, [currentProduct.id]);

  const gallery = selectedColor.images.length ? selectedColor.images : [mainImage(currentProduct)].filter(Boolean);
  const activeImage = gallery[activeImageIndex] ?? gallery[0];
  const unitsLeft = selectedSize ? unitsFor(currentProduct, selectedColor.id, selectedSize) : 0;
  const canBuy = unitsLeft > 0;
  const discountPercent = currentProduct.originalPrice
    ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)
    : 0;
  const pairings = [
    ...products.filter((p) => p.id !== currentProduct.id && p.category === currentProduct.category),
    ...products.filter((p) => p.id !== currentProduct.id && p.category !== currentProduct.category)
  ]
    .filter(isInStock)
    .slice(0, 2);

  const handleSelectColor = (color: ProductColor) => {
    setSelectedColor(color);
    setActiveImageIndex(0);
    // Keep the size if this colour has it, otherwise clear it so the customer picks again
    if (!selectedSize || unitsFor(currentProduct, color.id, selectedSize) === 0) setSelectedSize('');
    setQuantity(1);
  };

  const handleAddToCartClick = () => {
    if (!canBuy) return;
    onAddToCart(currentProduct, selectedSize, selectedColor, Math.min(quantity, unitsLeft));
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const details = [
    { label: 'Materiales', value: currentProduct.materials },
    { label: 'Horma', value: currentProduct.fit },
    { label: 'Cuidados', value: currentProduct.care }
  ].filter((d) => d.value);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
      <button
        onClick={onBackToCatalog}
        className="inline-flex items-center gap-1.5 text-sm font-extrabold bg-white border-2 border-ink rounded-full pl-2 pr-4 py-1.5 hover:shadow-pop-sm transition-shadow cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={3} />
        Volver al catálogo
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className="relative rounded-[2rem] overflow-hidden border-2 border-ink shadow-pop-lg aspect-square"
            style={{ backgroundColor: currentProduct.cardColor }}
          >
            {activeImage && (
              <img src={activeImage} alt={`${currentProduct.title} en ${selectedColor.name}`} className="w-full h-full object-cover" />
            )}
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((url, idx) => (
                <button
                  key={url + idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 border-ink transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'shadow-pop -translate-y-0.5' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: currentProduct.cardColor }}
                  aria-label={`Ver foto ${idx + 1}`}
                  aria-pressed={activeImageIndex === idx}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider bg-grape-soft border-2 border-ink rounded-full px-3 py-1">
                {styleName(currentProduct.category)} · {currentProduct.targetGender}
              </span>
              {currentProduct.badge && (
                <span className="text-xs font-extrabold uppercase tracking-wider bg-sun border-2 border-ink rounded-full px-3 py-1">
                  {currentProduct.badge}
                </span>
              )}
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-extrabold leading-none">{currentProduct.title}</h1>
            {currentProduct.subtitle && <p className="text-lg text-ink/70">{currentProduct.subtitle}</p>}
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-display text-5xl font-extrabold">{formatPrice(currentProduct.price)}</span>
            {currentProduct.originalPrice && (
              <>
                <span className="text-xl text-ink/40 line-through">{formatPrice(currentProduct.originalPrice)}</span>
                <span className="text-sm font-extrabold bg-bubble text-white border-2 border-ink rounded-full px-3 py-1 -rotate-3">
                  Ahorras {discountPercent}%
                </span>
              </>
            )}
            <p className="w-full text-sm text-ink/70">
              Paga con <strong className="text-ink">PSE, Nequi o tarjeta</strong>.
            </p>
          </div>

          {currentProduct.highlight && (
            <p className="p-4 rounded-2xl border-2 border-ink bg-lime-soft font-medium">{currentProduct.highlight}</p>
          )}

          {/* Colour */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-extrabold">
              Color: <span className="font-medium text-ink/70">{selectedColor.name}</span>
            </legend>
            <div className="flex flex-wrap items-center gap-3">
              {currentProduct.colors.map((color) => {
                const active = selectedColor.id === color.id;
                const colorSoldOut = !currentProduct.sizes.some((s) => unitsFor(currentProduct, color.id, s) > 0);
                return (
                  <button
                    key={color.id}
                    onClick={() => handleSelectColor(color)}
                    className={`relative w-11 h-11 rounded-full border-2 border-ink transition-all cursor-pointer ${
                      active ? 'ring-4 ring-grape ring-offset-2 ring-offset-cream' : 'hover:scale-110'
                    } ${colorSoldOut ? 'opacity-40' : ''}`}
                    style={{ backgroundColor: color.colorHex }}
                    aria-label={colorSoldOut ? `${color.name} (agotado)` : color.name}
                    aria-pressed={active}
                  />
                );
              })}
            </div>
          </fieldset>

          {/* Size */}
          <fieldset className="space-y-3">
            <div className="flex items-center justify-between">
              <legend className="text-sm font-extrabold">Talla (Colombia)</legend>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-sm font-bold underline decoration-2 underline-offset-4 flex items-center gap-1 hover:text-grape cursor-pointer"
              >
                <Ruler className="w-4 h-4" />
                Guía de tallas
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {currentProduct.sizes.map((size) => {
                const units = unitsFor(currentProduct, selectedColor.id, size);
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setQuantity(1);
                    }}
                    disabled={units === 0}
                    className={`relative py-3 rounded-2xl border-2 text-sm font-extrabold transition-all ${
                      active
                        ? 'bg-ink text-lime border-ink shadow-pop-sm'
                        : units > 0
                        ? 'bg-white border-ink hover:bg-lime-soft cursor-pointer'
                        : 'bg-transparent border-ink/20 text-ink/30 line-through cursor-not-allowed'
                    }`}
                    aria-pressed={active}
                    aria-label={units === 0 ? `Talla ${size}, agotada` : `Talla ${size}`}
                  >
                    {size}
                    {units > 0 && units <= LOW_STOCK_THRESHOLD && (
                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-bubble border-2 border-ink" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
            {!selectedSize && isInStock(currentProduct) && <p className="text-sm font-bold text-grape">Elige tu talla.</p>}
            {canBuy && unitsLeft <= LOW_STOCK_THRESHOLD && (
              <p className="text-sm font-bold text-bubble">
                ¡{unitsLeft === 1 ? 'Solo queda 1 par' : `Solo quedan ${unitsLeft} pares`} en talla {selectedSize}!
              </p>
            )}
          </fieldset>

          {/* CTAs */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex items-center bg-white border-2 border-ink rounded-full h-14 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-full flex items-center justify-center cursor-pointer"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" strokeWidth={3} />
                </button>
                <span className="w-6 text-center font-extrabold" aria-live="polite">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(quantity + 1, Math.max(1, unitsLeft)))}
                  className="w-11 h-full flex items-center justify-center cursor-pointer"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} />
                </button>
              </div>
              <button
                onClick={handleAddToCartClick}
                disabled={!canBuy}
                className="flex-1 h-14 bg-lime border-2 border-ink rounded-full font-extrabold flex items-center justify-center gap-2 shadow-pop hover:shadow-pop-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-pop-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-pop"
              >
                <ShoppingBag className="w-5 h-5" />
                {isInStock(currentProduct) ? 'Añadir a la bolsa' : 'Agotado'}
              </button>
              <button
                onClick={() => onToggleFavorite(currentProduct)}
                className={`w-14 h-14 shrink-0 rounded-full border-2 border-ink flex items-center justify-center transition-colors cursor-pointer ${
                  isFavorite ? 'bg-bubble text-white' : 'bg-white hover:bg-bubble-soft'
                }`}
                aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                aria-pressed={isFavorite}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
            <button
              onClick={() => canBuy && onDirectBuyNow(currentProduct, selectedSize, selectedColor)}
              disabled={!canBuy}
              className="w-full h-14 bg-ink text-white rounded-full font-extrabold flex items-center justify-center gap-2 hover:bg-grape transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-ink"
            >
              <Zap className="w-5 h-5 fill-lime text-lime" />
              Comprar ahora
            </button>
            {addedToast && (
              <p className="p-3 bg-lime-soft border-2 border-ink rounded-2xl text-sm font-bold flex items-center gap-2" role="status">
                <Check className="w-5 h-5 shrink-0" strokeWidth={3} />
                ¡{currentProduct.title} ya está en tu bolsa!
              </p>
            )}
          </div>

          <ul className="grid grid-cols-3 gap-2 text-xs font-bold text-center">
            {[
              { icon: Truck, text: `Envío gratis desde ${formatPrice(BRAND_INFO.freeShippingFrom)}` },
              { icon: RotateCcw, text: '30 días para cambios' },
              { icon: ShieldCheck, text: 'Pago 100% seguro' }
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border-2 border-ink">
                <Icon className="w-5 h-5" />
                {text}
              </li>
            ))}
          </ul>

          {(currentProduct.description || details.length > 0) && (
            <div className="bg-white border-2 border-ink rounded-3xl overflow-hidden">
              <div className="flex border-b-2 border-ink" role="tablist">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-sm font-extrabold transition-colors cursor-pointer ${
                      activeTab === tab.id ? 'bg-sun' : 'hover:bg-cream'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-5 text-sm leading-relaxed" role="tabpanel">
                {activeTab === 'descripcion' && (
                  <p className="whitespace-pre-line">{currentProduct.description || 'Pronto agregaremos la descripción.'}</p>
                )}
                {activeTab === 'detalles' &&
                  (details.length ? (
                    <dl className="space-y-3">
                      {details.map((d) => (
                        <div key={d.label}>
                          <dt className="font-extrabold">{d.label}</dt>
                          <dd>{d.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p>Pronto agregaremos más detalles.</p>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {pairings.length > 0 && (
        <section className="space-y-5">
          <h2 className="font-display text-4xl font-extrabold">También te van a gustar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pairings.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="flex items-center gap-4 p-3 bg-white border-2 border-ink rounded-3xl shadow-pop hover:shadow-pop-lg hover:-translate-y-0.5 transition-all text-left cursor-pointer"
              >
                <span className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 border-ink" style={{ backgroundColor: p.cardColor }}>
                  <img src={mainImage(p)} alt="" className="w-full h-full object-cover" />
                </span>
                <span className="space-y-1">
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-grape">{styleName(p.category)}</span>
                  <span className="block font-display text-2xl font-extrabold">{p.title}</span>
                  <span className="block font-bold">{formatPrice(p.price)}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
