import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { PRODUCTS_CATALOG, BRAND_INFO } from '../data/catalog';
import {
  Star,
  Ruler,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronLeft,
  Zap,
  MessageSquare,
  Minus,
  Plus
} from 'lucide-react';
import { SizeGuideModal } from './SizeGuideModal';
import { formatPrice } from '../utils/format';

interface ProductDetailViewProps {
  currentProduct: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, colorName: string, image: string) => void;
  onDirectBuyNow: (product: Product, size: string, colorName: string, image: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onBackToCatalog: () => void;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  fitFeedback: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Lucía S.',
    rating: 5,
    date: 'Hace 3 días',
    comment: 'Súper cómodos desde el primer día, no tuve que domarlos. Pedí mi talla de siempre y me quedaron perfectos.',
    fitFeedback: 'Fiel a la talla'
  },
  {
    id: 'rev-2',
    author: 'Mateo R.',
    rating: 5,
    date: 'Hace 1 semana',
    comment: 'Los colores son todavía mejores en persona. Los uso para todo y la suela agarra muy bien.',
    fitFeedback: 'Fiel a la talla'
  }
];

const TABS = [
  { id: 'estilo', label: 'Estilo' },
  { id: 'tecnico', label: 'Ficha técnica' },
  { id: 'cuidados', label: 'Cuidados' }
] as const;

const defaultSize = (product: Product) =>
  product.sizes.find((s) => s.size === '39' && s.available)?.size ??
  product.sizes.find((s) => s.available)?.size ??
  product.sizes[0].size;

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  currentProduct,
  onSelectProduct,
  onAddToCart,
  onDirectBuyNow,
  isFavorite,
  onToggleFavorite,
  onBackToCatalog
}) => {
  const [selectedColor, setSelectedColor] = useState(currentProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState(defaultSize(currentProduct));
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('estilo');
  const [addedToast, setAddedToast] = useState(false);

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    setSelectedColor(currentProduct.colors[0]);
    setSelectedSize(defaultSize(currentProduct));
    setActiveImageIndex(0);
    setQuantity(1);
  }, [currentProduct.id]);

  const gallery = currentProduct.galleryImages;
  const activeImage = gallery[activeImageIndex] ?? gallery[0];
  const currentSizeObj = currentProduct.sizes.find((s) => s.size === selectedSize);
  const discountPercent = currentProduct.originalPrice
    ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)
    : 0;
  const pairings = currentProduct.pairingSuggestions
    .map((s) => PRODUCTS_CATALOG.find((p) => p.id === s.productId))
    .filter((p): p is Product => Boolean(p));

  const handleSelectColor = (color: Product['colors'][number]) => {
    setSelectedColor(color);
    const idx = gallery.findIndex((g) => g.url === color.image);
    if (idx > -1) setActiveImageIndex(idx);
  };

  const handleAddToCartClick = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(currentProduct, selectedSize, selectedColor.name, selectedColor.image);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    setReviews((prev) => [
      {
        id: `rev-${Date.now()}`,
        author: newReviewAuthor.trim(),
        rating: newReviewRating,
        date: 'Hoy',
        comment: newReviewComment.trim(),
        fitFeedback: 'Fiel a la talla'
      },
      ...prev
    ]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const inputClass = 'w-full px-4 py-2.5 bg-white border-2 border-ink rounded-2xl focus:outline-hidden focus:shadow-pop-sm';

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
            <img
              src={activeImage.url}
              alt={`${currentProduct.title}: ${activeImage.label}`}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-white border-2 border-ink rounded-full px-3 py-1 text-xs font-extrabold">
              {activeImage.label}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {gallery.map((image, idx) => (
              <button
                key={image.url + idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 border-ink transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'shadow-pop -translate-y-0.5' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: currentProduct.cardColor }}
                aria-label={`Ver imagen: ${image.label}`}
                aria-pressed={activeImageIndex === idx}
              >
                <img src={image.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider bg-grape-soft border-2 border-ink rounded-full px-3 py-1">
                {currentProduct.subcategory} · {currentProduct.targetGender}
              </span>
              {currentProduct.badge && (
                <span className="text-xs font-extrabold uppercase tracking-wider bg-sun border-2 border-ink rounded-full px-3 py-1">
                  {currentProduct.badge}
                </span>
              )}
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-extrabold leading-none">{currentProduct.title}</h1>
            <p className="text-lg text-ink/70">{currentProduct.subtitle}</p>
            <a href="#resenas" className="inline-flex items-center gap-1.5 text-sm font-bold hover:text-grape">
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 text-ink ${i < Math.round(currentProduct.rating) ? 'fill-sun' : ''}`} />
                ))}
              </span>
              {currentProduct.rating} · {currentProduct.reviewCount} opiniones
            </a>
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

          <p className="p-4 rounded-2xl border-2 border-ink bg-lime-soft font-medium">
            {currentProduct.hook}
          </p>

          {/* Colour */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-extrabold">
              Color: <span className="font-medium text-ink/70">{selectedColor.name}</span>
            </legend>
            <div className="flex items-center gap-3">
              {currentProduct.colors.map((color) => {
                const active = selectedColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => handleSelectColor(color)}
                    className={`w-11 h-11 rounded-full border-2 border-ink transition-all cursor-pointer ${
                      active ? 'ring-4 ring-grape ring-offset-2 ring-offset-cream' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.colorHex }}
                    aria-label={color.name}
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
              {currentProduct.sizes.map((s) => {
                const active = selectedSize === s.size;
                return (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    disabled={!s.available}
                    className={`relative py-3 rounded-2xl border-2 text-sm font-extrabold transition-all ${
                      active
                        ? 'bg-ink text-lime border-ink shadow-pop-sm'
                        : s.available
                        ? 'bg-white border-ink hover:bg-lime-soft cursor-pointer'
                        : 'bg-transparent border-ink/20 text-ink/30 line-through cursor-not-allowed'
                    }`}
                    aria-pressed={active}
                  >
                    {s.size}
                    {s.available && s.stockCount !== undefined && s.stockCount <= 3 && (
                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-bubble border-2 border-ink" aria-label="Pocas unidades" />
                    )}
                  </button>
                );
              })}
            </div>
            {currentSizeObj?.stockCount !== undefined && currentSizeObj.stockCount <= 3 && (
              <p className="text-sm font-bold text-bubble">¡Solo quedan {currentSizeObj.stockCount} pares en talla {selectedSize}!</p>
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
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-full flex items-center justify-center cursor-pointer"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} />
                </button>
              </div>
              <button
                onClick={handleAddToCartClick}
                className="flex-1 h-14 bg-lime border-2 border-ink rounded-full font-extrabold flex items-center justify-center gap-2 shadow-pop hover:shadow-pop-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-pop-sm transition-all cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                Añadir a la bolsa
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
              onClick={() => onDirectBuyNow(currentProduct, selectedSize, selectedColor.name, selectedColor.image)}
              className="w-full h-14 bg-ink text-white rounded-full font-extrabold flex items-center justify-center gap-2 hover:bg-grape transition-colors cursor-pointer"
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

          {/* Details tabs */}
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
            <div className="p-5 text-sm leading-relaxed space-y-3" role="tabpanel">
              {activeTab === 'estilo' && (
                <>
                  <p>{currentProduct.storytelling}</p>
                  <dl className="space-y-2">
                    <div><dt className="inline font-extrabold">Cuándo usarlos: </dt><dd className="inline">{currentProduct.styleBenefits.whenToWear}</dd></div>
                    <div><dt className="inline font-extrabold">Cómo combinarlos: </dt><dd className="inline">{currentProduct.styleBenefits.howToStyle}</dd></div>
                    <div><dt className="inline font-extrabold">Sensación: </dt><dd className="inline">{currentProduct.styleBenefits.comfortVibe}</dd></div>
                  </dl>
                </>
              )}
              {activeTab === 'tecnico' && (
                <dl className="space-y-2">
                  <div><dt className="font-extrabold">Materiales</dt><dd>{currentProduct.technicalSpecs.materials}</dd></div>
                  <div><dt className="font-extrabold">Horma</dt><dd>{currentProduct.technicalSpecs.fitType}</dd></div>
                  {currentProduct.technicalSpecs.ecoDetails && (
                    <div><dt className="font-extrabold">Sostenibilidad</dt><dd>{currentProduct.technicalSpecs.ecoDetails}</dd></div>
                  )}
                </dl>
              )}
              {activeTab === 'cuidados' && (
                <ul className="space-y-1.5 list-disc pl-5">
                  {currentProduct.careInstructions.map((instruction) => (
                    <li key={instruction}>{instruction}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pairings */}
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
                  <img src={p.heroImage} alt="" className="w-full h-full object-cover" />
                </span>
                <span className="space-y-1">
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-grape">{p.subcategory}</span>
                  <span className="block font-display text-2xl font-extrabold">{p.title}</span>
                  <span className="block font-bold">{formatPrice(p.price)}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section id="resenas" className="space-y-6 scroll-mt-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-extrabold flex items-center gap-3">
            <MessageSquare className="w-8 h-8" />
            Opiniones ({reviews.length})
          </h2>
          <span className="font-display text-2xl font-extrabold bg-sun border-2 border-ink rounded-2xl px-4 py-1 shadow-pop-sm">
            {currentProduct.rating} / 5
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <article key={rev.id} className="p-5 bg-white rounded-3xl border-2 border-ink space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold">{rev.author}</span>
                <span className="text-xs text-ink/50">{rev.date}</span>
              </div>
              <div className="flex" aria-label={`${rev.rating} de 5 estrellas`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 text-ink ${i < rev.rating ? 'fill-sun' : ''}`} />
                ))}
              </div>
              <p className="text-ink/80">{rev.comment}</p>
              <span className="inline-block text-xs font-bold bg-lime-soft border-2 border-ink rounded-full px-2.5 py-0.5">
                Talla: {rev.fitFeedback}
              </span>
            </article>
          ))}
        </div>

        <form onSubmit={handleAddReview} className="p-6 bg-grape-soft rounded-3xl border-2 border-ink max-w-2xl space-y-4">
          <h3 className="font-display text-2xl font-extrabold">¿Ya los tienes? Cuéntanos qué tal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <label className="space-y-1">
              <span className="font-bold">Tu nombre</span>
              <input
                type="text"
                required
                placeholder="Ej. Sofía V."
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="space-y-1">
              <span className="font-bold">Puntuación</span>
              <select value={newReviewRating} onChange={(e) => setNewReviewRating(Number(e.target.value))} className={inputClass}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{'★'.repeat(n)} ({n} de 5)</option>
                ))}
              </select>
            </label>
          </div>
          <label className="block space-y-1 text-sm">
            <span className="font-bold">Tu comentario</span>
            <textarea
              required
              rows={3}
              placeholder="¿Qué tal la talla? ¿Son cómodos?"
              value={newReviewComment}
              onChange={(e) => setNewReviewComment(e.target.value)}
              className={inputClass}
            />
          </label>
          <div className="flex items-center gap-3">
            <button type="submit" className="px-6 py-3 bg-ink text-white rounded-full font-extrabold hover:bg-grape transition-colors cursor-pointer">
              Publicar opinión
            </button>
            {reviewSubmitted && <p className="font-bold" role="status">¡Gracias por tu opinión!</p>}
          </div>
        </form>
      </section>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
