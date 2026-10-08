import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Star, 
  Ruler, 
  Heart, 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  Zap,
  MessageSquare
} from 'lucide-react';
import { SizeGuideModal } from './SizeGuideModal';

interface ProductDetailViewProps {
  currentProduct: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, colorName: string, image: string) => void;
  onDirectBuyNow: (product: Product, size: string, colorName: string, image: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onBackToCatalog: () => void;
}

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
  const [selectedSize, setSelectedSize] = useState<string>(currentProduct.sizes[1]?.size || currentProduct.sizes[0]?.size);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'historia' | 'tecnico' | 'cuidados'>('historia');
  const [addedToast, setAddedToast] = useState(false);

  // Reviews state with real interaction
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      author: 'Lucía S.',
      rating: 5,
      date: 'Hace 3 días',
      title: 'Increíble caída y no da calor',
      comment: 'Es tal cual se describe. La tela tiene cuerpo pero respira genial. Me pedí mi talla habitual y el fit relajado queda perfecto.',
      fitFeedback: 'Fiel a la talla'
    },
    {
      id: 'rev-2',
      author: 'Mateo R.',
      rating: 5,
      date: 'Hace 1 semana',
      title: 'Calidad superior, vale cada céntimo',
      comment: 'Las costuras y los remates están a otro nivel comparado con las marcas de fast-fashion habituales. Muy contento con la compra.',
      fitFeedback: 'Fiel a la talla'
    }
  ]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Sync color when product changes
  React.useEffect(() => {
    setSelectedColor(currentProduct.colors[0]);
    setSelectedSize(currentProduct.sizes[1]?.size || currentProduct.sizes[0]?.size);
    setActiveImageIndex(0);
    setQuantity(1);
  }, [currentProduct.id]);

  const activeImage = currentProduct.galleryImages[activeImageIndex] || {
    url: currentProduct.heroImage,
    label: 'Vista Principal',
    type: 'studio',
    description: 'Vista principal del producto'
  };

  const currentSizeObj = currentProduct.sizes.find(s => s.size === selectedSize);
  const discountPercent = currentProduct.originalPrice
    ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)
    : 0;

  const handleAddToCartClick = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(currentProduct, selectedSize, selectedColor.name, selectedColor.image);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNowClick = () => {
    onDirectBuyNow(currentProduct, selectedSize, selectedColor.name, selectedColor.image);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    setReviews(prev => [
      {
        id: `rev-${Date.now()}`,
        author: newReviewAuthor.trim(),
        rating: newReviewRating,
        date: 'Hoy',
        title: 'Opinión verificada',
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

  const sizeGuideType = currentProduct.id.includes('vestido')
    ? 'vestido'
    : currentProduct.id.includes('jean') || currentProduct.id.includes('chino')
    ? 'pantalon'
    : currentProduct.id.includes('sneakers') || currentProduct.id.includes('sandalia')
    ? 'calzado'
    : 'general';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500">
        <button onClick={onBackToCatalog} className="hover:text-stone-900 transition-colors cursor-pointer">
          Catálogo
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="capitalize">{currentProduct.targetGender}</span>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-900 font-medium">{currentProduct.subcategory}</span>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-700 truncate max-w-xs">{currentProduct.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Visual Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative group rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 aspect-4/5 shadow-xs">
            <img
              src={activeImage.url}
              alt={`${currentProduct.title} - ${activeImage.label}`}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />

            {/* Photo Type Label */}
            <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
              {activeImage.label}
            </div>

            {/* Image description tooltip on hover */}
            <div className="absolute bottom-0 inset-x-0 bg-stone-950/75 backdrop-blur-xs text-white p-3 text-[11px] translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              {activeImage.description}
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 gap-3">
            {currentProduct.galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-4/5 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-stone-900 ring-2 ring-stone-900/20 shadow-sm'
                    : 'border-transparent opacity-70 hover:opacity-100 hover:border-stone-300'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 inset-x-1 text-center bg-stone-900/80 text-white text-[9px] py-0.5 rounded truncate">
                  {img.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Pricing, Buy Actions, Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Info */}
          <div className="space-y-2 border-b border-stone-200 pb-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                {currentProduct.subcategory} · {currentProduct.targetGender}
              </p>
              {currentProduct.badge && (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {currentProduct.badge}
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {currentProduct.title}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {currentProduct.subtitle}
            </p>

            {/* Ratings & Social Proof */}
            <div className="flex items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="font-semibold text-stone-900 ml-1">{currentProduct.rating}</span>
              </div>
              <span className="text-stone-300">·</span>
              <a href="#resenas" className="text-stone-600 underline cursor-pointer hover:text-stone-900">
                {currentProduct.reviewCount} opiniones verificadas
              </a>
              <span className="text-stone-300">·</span>
              <span className="text-emerald-700 font-medium">96% calce exacto</span>
            </div>
          </div>

          {/* Pricing & Installments */}
          <div className="space-y-1.5 border-b border-stone-200 pb-5">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-stone-900">
                ${currentProduct.price.toFixed(2)}
              </span>
              {currentProduct.originalPrice && (
                <>
                  <span className="text-sm text-stone-400 line-through">
                    ${currentProduct.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                    Ahorras {discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-stone-600 flex items-center gap-1.5">
              <span>O en <strong>3 cuotas de ${(currentProduct.price / 3).toFixed(2)}</strong> sin intereses con Klarna o PayPal.</span>
            </p>
          </div>

          {/* Hook Copy */}
          <div className="p-3.5 bg-stone-100/70 border-l-4 border-stone-900 rounded-r-lg space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block">
              Por qué te va a encantar
            </span>
            <p className="text-xs text-stone-800 italic leading-relaxed">
              "{currentProduct.hook}"
            </p>
          </div>

          {/* Color Variant Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800">
                Color: <span className="font-normal text-stone-600">{selectedColor.name}</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {currentProduct.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer relative ${
                    selectedColor.id === color.id
                      ? 'border-stone-900 scale-110 ring-2 ring-stone-900/20'
                      : 'border-white hover:scale-105 shadow-xs'
                  }`}
                  style={{ backgroundColor: color.colorHex }}
                  title={color.name}
                >
                  {selectedColor.id === color.id && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className={`w-2 h-2 rounded-full ${color.colorHex === '#262626' ? 'bg-white' : 'bg-stone-900'}`} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector with Interactive Size Guide */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800">
                Selecciona Talla:
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-stone-700 hover:text-stone-950 underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                Guía de tallas & recomendador
              </button>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {currentProduct.sizes.map((s) => (
                <button
                  key={s.size}
                  onClick={() => setSelectedSize(s.size)}
                  disabled={!s.available}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer relative ${
                    selectedSize === s.size
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : s.available
                      ? 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                      : 'bg-stone-100 text-stone-400 border-stone-200 line-through cursor-not-allowed'
                  }`}
                >
                  {s.size}
                  {s.stockCount && s.stockCount <= 3 && s.available && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {/* Low stock ethical urgency */}
            {currentSizeObj && currentSizeObj.stockCount && currentSizeObj.stockCount <= 3 && (
              <p className="text-[11px] text-amber-800 font-medium flex items-center gap-1 pt-0.5">
                <span>⚡ ¡Solo quedan <strong>{currentSizeObj.stockCount} unidades</strong> en talla {selectedSize}!</span>
              </p>
            )}
          </div>

          {/* Quantity Selector + CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-2 items-center">
              {/* Quantity */}
              <div className="flex items-center border border-stone-300 rounded-xl bg-white text-xs h-[48px] px-2 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-2 font-semibold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCartClick}
                className="flex-1 h-[48px] px-6 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                Añadir a la Bolsa
              </button>

              {/* Wishlist */}
              <button
                onClick={() => onToggleFavorite(currentProduct)}
                className={`h-[48px] w-[48px] border rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                  isFavorite 
                    ? 'border-rose-300 bg-rose-50 text-rose-600' 
                    : 'border-stone-200 hover:border-stone-400 text-stone-700 bg-white'
                }`}
                aria-label="Guardar en favoritos"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Direct Buy Now Button */}
            <button
              onClick={handleBuyNowClick}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-98"
            >
              <Zap className="w-4 h-4 fill-current" />
              Comprar Ahora con 1 Clic
            </button>

            {/* Confirmation toast */}
            {addedToast && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¡{currentProduct.title} añadido a tu bolsa de compra!</span>
              </div>
            )}
          </div>

          {/* Trust Pillars Micro-copy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-stone-200 text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Envío 24-48h gratis desde $49</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg">
              <RotateCcw className="w-4 h-4 text-stone-700 shrink-0" />
              <span>30 días de cambio sin coste</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
              <span>Garantía de calidad NOMAD</span>
            </div>
          </div>

          {/* Persuasive Accordions */}
          <div className="border border-stone-200 rounded-xl overflow-hidden pt-1 bg-white">
            <div className="flex border-b border-stone-200 bg-stone-50/70 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('historia')}
                className={`flex-1 py-2.5 text-center transition-colors cursor-pointer ${
                  activeTab === 'historia' ? 'border-b-2 border-stone-900 text-stone-900 bg-white' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Estilo & Beneficios
              </button>
              <button
                onClick={() => setActiveTab('tecnico')}
                className={`flex-1 py-2.5 text-center transition-colors cursor-pointer ${
                  activeTab === 'tecnico' ? 'border-b-2 border-stone-900 text-stone-900 bg-white' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Ficha Técnica
              </button>
              <button
                onClick={() => setActiveTab('cuidados')}
                className={`flex-1 py-2.5 text-center transition-colors cursor-pointer ${
                  activeTab === 'cuidados' ? 'border-b-2 border-stone-900 text-stone-900 bg-white' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Cuidados & Lavado
              </button>
            </div>

            <div className="p-4 text-xs text-stone-700 space-y-3">
              {activeTab === 'historia' && (
                <div className="space-y-3">
                  <p className="leading-relaxed text-stone-800">
                    {currentProduct.storytelling}
                  </p>
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <div>
                      <strong className="text-stone-900">Cuándo llevarlo: </strong>
                      <span>{currentProduct.styleBenefits.whenToWear}</span>
                    </div>
                    <div>
                      <strong className="text-stone-900">Cómo combinarlo: </strong>
                      <span>{currentProduct.styleBenefits.howToStyle}</span>
                    </div>
                    <div>
                      <strong className="text-stone-900">Sensación de uso: </strong>
                      <span>{currentProduct.styleBenefits.comfortVibe}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tecnico' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-1 py-1 border-b border-stone-100">
                    <span className="font-semibold text-stone-900">Composición:</span>
                    <span className="col-span-2">{currentProduct.technicalSpecs.materials}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-1 border-b border-stone-100">
                    <span className="font-semibold text-stone-900">Calce / Fit:</span>
                    <span className="col-span-2">{currentProduct.technicalSpecs.fitType}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-1 border-b border-stone-100">
                    <span className="font-semibold text-stone-900">Fabricación:</span>
                    <span className="col-span-2">{currentProduct.technicalSpecs.origin}</span>
                  </div>
                  {currentProduct.technicalSpecs.ecoDetails && (
                    <div className="grid grid-cols-3 gap-1 py-1">
                      <span className="font-semibold text-stone-900">Sostenibilidad:</span>
                      <span className="col-span-2 text-emerald-800">{currentProduct.technicalSpecs.ecoDetails}</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'cuidados' && (
                <ul className="space-y-1.5 list-disc list-inside text-stone-600">
                  {currentProduct.careInstructions.map((instruction, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {instruction}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* "Get The Look" Cross-selling */}
          {currentProduct.pairingSuggestions.length > 0 && (
            <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
                  Completa tu Outfit (Get The Look)
                </span>
                <span className="text-[11px] text-stone-500 font-medium">Recomendado</span>
              </div>

              <div className="space-y-2">
                {currentProduct.pairingSuggestions.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-2 bg-white rounded-lg border border-stone-200 hover:border-stone-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-14 object-cover rounded-md bg-stone-100"
                      />
                      <div>
                        <h4 className="text-xs font-medium text-stone-900">{item.title}</h4>
                        <p className="text-xs font-semibold text-stone-700">${item.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const targetProd = [currentProduct, ...currentProduct.pairingSuggestions].find(p => (p as any).id === item.productId);
                        if (targetProd) onSelectProduct(targetProd as any);
                      }}
                      className="text-xs font-medium px-2.5 py-1 text-stone-900 hover:bg-stone-100 rounded-md transition-colors border border-stone-200 cursor-pointer"
                    >
                      Ver Prenda
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="resenas" className="border-t border-stone-200 pt-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-stone-800" />
              Opiniones de la Comunidad ({reviews.length})
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Experiencias de compradores reales con el calce y los materiales de esta prenda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="font-bold text-stone-900 text-sm">4.9 / 5.0</span>
          </div>
        </div>

        {/* Reviews list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-4 bg-white rounded-xl border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-900">{rev.author}</span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                    ✓ Comprador Verificado
                  </span>
                </div>
                <span className="text-stone-400 text-[11px]">{rev.date}</span>
              </div>

              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
                <span className="text-stone-700 font-semibold ml-1">{rev.title}</span>
              </div>

              <p className="text-stone-600 leading-relaxed">{rev.comment}</p>
              <div className="text-[10px] text-stone-500 font-mono">Calce: {rev.fitFeedback}</div>
            </div>
          ))}
        </div>

        {/* Add review form */}
        <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 max-w-xl space-y-3">
          <h4 className="font-display font-semibold text-stone-900 text-sm">
            ¿Ya tienes esta prenda? Comparte tu experiencia
          </h4>
          <form onSubmit={handleAddReview} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Tu Nombre</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sofía V."
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-medium mb-1">Puntuación</label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 de 5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 de 5)</option>
                  <option value={3}>⭐⭐⭐ (3 de 5)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Tu Comentario</label>
              <textarea
                required
                rows={2}
                placeholder="¿Cómo te quedó la talla? ¿Qué te pareció la tela?"
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 text-white font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Publicar Opinión
            </button>

            {reviewSubmitted && (
              <p className="text-emerald-700 font-medium text-xs">¡Gracias! Tu opinión se ha publicado.</p>
            )}
          </form>
        </div>
      </section>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productType={sizeGuideType}
      />
    </div>
  );
};
