import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { SNEAKER_STYLES, BRAND_INFO } from '../data/catalog';
import { Logo } from './Logo';

interface FooterProps {
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-ink text-white rounded-t-[2.5rem] mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 space-y-4">
            <Logo inverted />
            <p className="text-white/70 max-w-sm">
              {BRAND_INFO.tagline}. Running, urbanos, basket, retro y skate con envío rápido y cambios fáciles.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h2 className="font-display text-lg font-extrabold text-lime">Estilos</h2>
            <ul className="space-y-2">
              {SNEAKER_STYLES.map((style) => (
                <li key={style.slug}>
                  <button
                    onClick={() => onSelectCategory(style.slug)}
                    className="text-white/75 hover:text-white hover:underline underline-offset-4 cursor-pointer"
                  >
                    {style.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5 space-y-3">
            <h2 className="font-display text-lg font-extrabold text-lime">Únete al club TenisIvan</h2>
            <p className="text-white/70">
              Lanzamientos antes que nadie y <strong className="text-white">10% de descuento</strong> en tu primer par.
            </p>
            {subscribed ? (
              <p className="flex items-center gap-2 bg-lime text-ink rounded-full px-4 py-3 font-bold w-fit" role="status">
                <Check className="w-4.5 h-4.5" strokeWidth={3} />
                ¡Listo! Tu código es {BRAND_INFO.welcomeCode}
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="tu@email.com"
                  aria-label="Tu email"
                  autoComplete="email"
                  required
                  className="flex-1 min-w-0 bg-white/10 border-2 border-white/30 focus:border-lime rounded-full px-4 py-3 text-sm placeholder:text-white/50 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="bg-lime text-ink font-extrabold px-5 py-3 rounded-full hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  Unirme <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <span>© {new Date().getFullYear()} TenisIvan. Todos los derechos reservados.</span>
          <span className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            <span>Visa / Mastercard</span>
            <span>PayPal</span>
            <span>Klarna</span>
            <span>Apple Pay</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
