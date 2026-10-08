import React from 'react';
import { Product } from '../types';
import { PRODUCTS_CATALOG, SNEAKER_STYLES, BRAND_INFO } from '../data/catalog';
import { ArrowRight, Truck, RotateCcw, CreditCard, Sparkles, Star } from 'lucide-react';
import { ProductCard } from './ProductCard';

interface HomeViewProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToCategory: (category: string) => void;
  favorites: Product[];
  onToggleFavorite: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectProduct,
  onNavigateToCategory,
  favorites,
  onToggleFavorite
}) => {
  const hero = PRODUCTS_CATALOG.find((p) => p.isBestSeller) ?? PRODUCTS_CATALOG[0];
  const hotPicks = PRODUCTS_CATALOG.filter((p) => p.badge).slice(0, 4);
  const firstOfStyle = (slug: string) => PRODUCTS_CATALOG.find((p) => p.category === slug);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-ink bg-grape text-white shadow-pop-lg">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-bubble/60 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-10 bottom-0 w-64 h-64 rounded-full bg-pool/40 blur-3xl" aria-hidden="true" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center p-6 sm:p-10 lg:p-14">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 bg-lime text-ink border-2 border-ink rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider shadow-pop-sm -rotate-2">
                <Sparkles className="w-3.5 h-3.5" />
                Nueva temporada 2026
              </span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95]">
                Pisa fuerte.
                <br />
                <span className="text-lime">Pisa con estilo.</span>
              </h1>
              <p className="text-base sm:text-lg text-white/85 max-w-md">
                Running, urbanos, basket, retro y skate. Tenis cómodos y con colores que se notan, elegidos para tu día a día.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigateToCategory('all')}
                  className="inline-flex items-center gap-2 bg-lime text-ink border-2 border-ink rounded-full px-6 py-3.5 font-extrabold shadow-pop hover:shadow-pop-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Ver todos los tenis
                  <ArrowRight className="w-4.5 h-4.5" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => onSelectProduct(hero)}
                  className="inline-flex items-center gap-2 bg-white text-ink border-2 border-ink rounded-full px-6 py-3.5 font-extrabold shadow-pop hover:shadow-pop-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  {hero.title}: ${hero.price.toFixed(2)}
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/85">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-sun text-sun" />
                  ))}
                </div>
                <span><strong className="text-white">4.8/5</strong> en más de 2.000 opiniones</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectProduct(hero)}
              className="relative mx-auto w-full max-w-md aspect-square cursor-pointer group"
              aria-label={`Ver ${hero.title}`}
            >
              <div className="absolute inset-4 rounded-[2rem] bg-sun border-2 border-ink rotate-6" aria-hidden="true" />
              <div className="absolute inset-4 rounded-[2rem] overflow-hidden border-2 border-ink -rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-bubble-soft">
                <img src={hero.heroImage} alt={hero.title} className="w-full h-full object-cover" />
              </div>
              <span className="absolute -bottom-1 -left-1 sm:left-0 bg-white text-ink border-2 border-ink rounded-2xl px-4 py-2 shadow-pop text-left">
                <span className="block text-xs font-bold uppercase tracking-wider text-grape">Top ventas</span>
                <span className="block font-display text-xl font-extrabold">{hero.title}</span>
              </span>
              {hero.originalPrice && (
                <span className="absolute top-0 right-0 w-20 h-20 rounded-full bg-bubble text-white border-2 border-ink shadow-pop flex flex-col items-center justify-center rotate-12 font-display font-extrabold leading-none">
                  <span className="text-2xl">-{Math.round((1 - hero.price / hero.originalPrice) * 100)}%</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Truck, title: 'Envío gratis', text: `En pedidos desde $${BRAND_INFO.freeShippingFrom}, en 24/48h.`, bg: 'bg-lime-soft' },
            { icon: RotateCcw, title: 'Cambios fáciles', text: '30 días para cambiar de talla sin costo.', bg: 'bg-pool-soft' },
            { icon: CreditCard, title: 'Paga a tu ritmo', text: '3 cuotas sin intereses con Klarna o PayPal.', bg: 'bg-sun-soft' }
          ].map(({ icon: Icon, title, text, bg }) => (
            <div key={title} className={`flex items-center gap-4 p-5 rounded-3xl border-2 border-ink ${bg}`}>
              <span className="w-12 h-12 shrink-0 rounded-2xl bg-white border-2 border-ink flex items-center justify-center shadow-pop-sm">
                <Icon className="w-5 h-5" strokeWidth={2.5} />
              </span>
              <div>
                <h2 className="font-display text-lg font-extrabold">{title}</h2>
                <p className="text-sm text-ink/70">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wider text-grape">Elige tu vibra</p>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold">Compra por estilo</h2>
          </div>
          <button
            onClick={() => onNavigateToCategory('all')}
            className="hidden sm:inline-flex items-center gap-1.5 font-extrabold underline decoration-2 underline-offset-4 hover:text-grape cursor-pointer"
          >
            Ver todo <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {SNEAKER_STYLES.map((style, i) => {
            const sample = firstOfStyle(style.slug);
            return (
              <button
                key={style.slug}
                onClick={() => onNavigateToCategory(style.slug)}
                className={`group relative overflow-hidden rounded-3xl border-2 border-ink shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all text-left cursor-pointer ${
                  i === 0 ? 'col-span-2 lg:col-span-1' : ''
                }`}
                style={{ backgroundColor: style.color }}
              >
                <div className="p-4 pb-0 space-y-1">
                  <h3 className="font-display text-2xl font-extrabold">{style.name}</h3>
                  <p className="text-sm font-medium text-ink/75">{style.tagline}</p>
                </div>
                {sample && (
                  <div className="m-4 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-ink bg-white">
                    <img
                      src={sample.heroImage}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <span className="absolute top-4 right-4 w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center group-hover:rotate-[-45deg] transition-transform">
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Hot picks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wider text-bubble">Lo más buscado</p>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold">Los más hot 🔥</h2>
          </div>
          <button
            onClick={() => onNavigateToCategory('all')}
            className="inline-flex items-center gap-1.5 font-extrabold underline decoration-2 underline-offset-4 hover:text-grape cursor-pointer"
          >
            Ver catálogo <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotPicks.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              isFavorite={favorites.some((f) => f.id === product.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-ink bg-sun p-8 sm:p-12 shadow-pop-lg grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="space-y-3">
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold leading-none">
              -10% en tu primer par
            </h2>
            <p className="text-base font-medium text-ink/80 max-w-lg">
              Usa el código en la bolsa y estrena tenis por menos. Válido en todo el catálogo.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <span className="font-display text-3xl font-extrabold bg-white border-2 border-dashed border-ink rounded-2xl px-5 py-3 -rotate-2">
              {BRAND_INFO.welcomeCode}
            </span>
            <button
              onClick={() => onNavigateToCategory('all')}
              className="inline-flex items-center gap-2 bg-ink text-white rounded-full px-6 py-3.5 font-extrabold hover:bg-grape transition-colors cursor-pointer"
            >
              Usar ahora <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
