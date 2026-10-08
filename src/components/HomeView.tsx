import React from 'react';
import { Product } from '../types';
import { PRODUCTS_CATALOG } from '../data/fashionData';
import { ArrowRight, Sparkles, Truck, RotateCcw, ShieldCheck, Heart, Star, ShoppingBag } from 'lucide-react';

interface HomeViewProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToCategory: (category: string) => void;
  onAddToCart: (product: Product, size: string, colorName: string, image: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectProduct,
  onNavigateToCategory,
  onAddToCart
}) => {
  const topSellers = PRODUCTS_CATALOG.slice(0, 4);

  return (
    <div className="space-y-16 pb-12">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden bg-stone-900 text-white min-h-[540px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1920&q=80"
            alt="Moda Casual NOMAD"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Drop de Temporada 2026 · Edición Limitada</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Prendas para vivir en movimiento.
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-lg">
              Denim pesado noventero, tejidos orgánicos prelavados y zapatillas con suela amortiguada. Moda casual honesta pensada para el día a día.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateToCategory('mujer')}
                className="px-6 py-3 bg-white text-stone-950 hover:bg-stone-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-95"
              >
                Colección Mujer
              </button>

              <button
                onClick={() => onNavigateToCategory('hombre')}
                className="px-6 py-3 bg-stone-800/90 text-white hover:bg-stone-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer backdrop-blur-sm border border-stone-700 active:scale-95"
              >
                Colección Hombre
              </button>

              <button
                onClick={() => onNavigateToCategory('calzado')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Sneakers & Zapatos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white rounded-2xl border border-stone-200 shadow-xs text-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Envíos Express 24-48h</h4>
              <p className="text-stone-500 mt-0.5">Gratis en todos los pedidos a partir de $49.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">30 Días para Cambios Gratis</h4>
              <p className="text-stone-500 mt-0.5">Pruébatelo en casa; si la talla no encaja, te la cambiamos sin coste.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Pago Flexible y Protegido</h4>
              <p className="text-stone-500 mt-0.5">3 plazos sin intereses con Klarna, PayPal o tarjeta bancaria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Category Shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1">
              Explora por Categoría
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              Colecciones Esenciales
            </h2>
          </div>
          <button
            onClick={() => onNavigateToCategory('all')}
            className="text-xs font-bold text-stone-900 hover:text-stone-600 flex items-center gap-1 cursor-pointer"
          >
            Ver Todo el Catálogo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              id: 'mujer',
              name: 'Mujer',
              subtitle: 'Vestidos, denim & tops fluidos',
              image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
            },
            {
              id: 'hombre',
              name: 'Hombre',
              subtitle: 'Cargos, hoodies & corte boxy',
              image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
            },
            {
              id: 'calzado',
              name: 'Calzado Urbano',
              subtitle: 'Retro sneakers & suelas cupsole',
              image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
            },
            {
              id: 'drops',
              name: 'Drops & Básicos 450 GSM',
              subtitle: 'Ediciones limitadas de temporada',
              image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
            }
          ].map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateToCategory(cat.id)}
              className="group relative aspect-3/4 rounded-2xl overflow-hidden bg-stone-100 cursor-pointer shadow-xs hover:shadow-lg transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
              <div className="absolute bottom-5 inset-x-5 text-white space-y-1">
                <h3 className="font-display font-bold text-lg sm:text-xl">{cat.name}</h3>
                <p className="text-xs text-stone-300">{cat.subtitle}</p>
                <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1 pt-1 group-hover:translate-x-1 transition-transform">
                  Descubrir prendas <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flagship Products (Top Sellers) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Favoritos de la Comunidad
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              Lo Más Vendido Esta Semana
            </h2>
          </div>
          <button
            onClick={() => onNavigateToCategory('all')}
            className="text-xs font-bold text-stone-900 hover:text-stone-600 flex items-center gap-1 cursor-pointer"
          >
            Ver todos los favoritos <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topSellers.map((product) => {
            const discountPercent = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : null;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-stone-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative aspect-4/5 bg-stone-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.heroImage}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {product.badge}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] text-stone-500">{product.subcategory} · {product.targetGender}</p>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-display font-semibold text-stone-900 text-sm hover:text-stone-700 cursor-pointer line-clamp-1 mt-0.5"
                    >
                      {product.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-1">{product.subtitle}</p>

                    <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-semibold text-stone-800">{product.rating}</span>
                      <span className="text-stone-400">({product.reviewCount})</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-stone-900 text-base">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">${product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-500 block">3x ${(product.price / 3).toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Ver Prenda
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* "Get The Look" Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 rounded-3xl p-8 sm:p-12 border border-stone-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-widest">
              Estilismo & Streetwear
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              Get The Look: El outfit perfecto en 3 clics.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Combinamos nuestro Jean Cargo Nomad '98 con las zapatillas Retro Subway '88 y el hoodie de 450 GSM. Prendas diseñadas para combinarse entre sí sin tener que pensar.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200">
                <img
                  src={PRODUCTS_CATALOG[1].heroImage}
                  alt={PRODUCTS_CATALOG[1].title}
                  className="w-12 h-14 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-stone-900">{PRODUCTS_CATALOG[1].title}</h4>
                  <p className="text-xs text-stone-700 font-semibold">${PRODUCTS_CATALOG[1].price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => onSelectProduct(PRODUCTS_CATALOG[1])}
                  className="text-xs text-stone-900 underline font-medium hover:text-stone-700 cursor-pointer"
                >
                  Ver
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200">
                <img
                  src={PRODUCTS_CATALOG[2].heroImage}
                  alt={PRODUCTS_CATALOG[2].title}
                  className="w-12 h-14 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-stone-900">{PRODUCTS_CATALOG[2].title}</h4>
                  <p className="text-xs text-stone-700 font-semibold">${PRODUCTS_CATALOG[2].price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => onSelectProduct(PRODUCTS_CATALOG[2])}
                  className="text-xs text-stone-900 underline font-medium hover:text-stone-700 cursor-pointer"
                >
                  Ver
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigateToCategory('drops')}
                className="px-6 py-3 bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Explorar Todos los Outfits
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-4/5 rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=80"
              alt="Outfit Completo NOMAD"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-stone-900/90 backdrop-blur-xs text-white p-3 rounded-xl text-xs space-y-0.5">
              <p className="font-bold">Total Outfit: $159.80</p>
              <p className="text-stone-300 text-[11px]">Ahorro del 15% al comprar el conjunto</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
