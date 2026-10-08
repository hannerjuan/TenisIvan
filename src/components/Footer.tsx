import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Heart, ArrowRight } from 'lucide-react';
import { BRAND_INFO } from '../data/fashionData';

interface FooterProps {
  onSelectCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Trust Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-stone-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Envíos 24-48h Garantizados</h4>
              <p className="text-stone-400">Gratis a partir de $49 con seguimiento en tiempo real.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">30 Días para Cambios de Talla</h4>
              <p className="text-stone-400">Si no te queda como querías, te enviamos tu nueva talla sin coste.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Pago Flexible y 100% Seguro</h4>
              <p className="text-stone-400">Divide tus compras en 3 plazos sin intereses con Klarna o PayPal.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-black tracking-tight text-white">
                NOMAD & CO.
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                STUDIO
              </span>
            </div>
            <p className="text-stone-400 leading-relaxed max-w-sm">
              Diseño contemporáneo, denim de alto gramaje y zapatillas ergonómicas pensadas para el ritmo de la calle. Creado para personas de 16 a 40 años que valoran la comodidad honesta sin poses forzadas.
            </p>
            <div className="flex items-center gap-2 text-stone-400 text-[11px]">
              <span>Hecho con</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>y obsesión por la experiencia UX/UI</span>
            </div>
          </div>

          {/* Catalog Sitemap */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display font-semibold text-white uppercase tracking-wider text-[11px]">
              Mujer
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li><span className="hover:text-white cursor-pointer transition-colors">Vestidos Camiseros</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Jeans Baggy & Wide</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Hoodies Oversize</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Tops de Algodón</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Sneakers Retro</span></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display font-semibold text-white uppercase tracking-wider text-[11px]">
              Hombre
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li><span className="hover:text-white cursor-pointer transition-colors">Jeans Cargo Nomad</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Camisetas Boxy 260 GSM</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Sobrecamisas Worker</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Sudaderas Heavyweight</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Calzado Urbano</span></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display font-semibold text-white uppercase tracking-wider text-[11px]">
              Únete al Club NOMAD (Drops & Descuentos)
            </h4>
            <p className="text-stone-400">
              Suscríbete para acceder a ediciones limitadas antes que nadie y recibe un <strong>10% de descuento</strong> en tu primera compra.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('¡Gracias por unirte a NOMAD Club! Código: BIENVENIDA10'); }} className="flex gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                required
                className="bg-stone-900 border border-stone-800 text-stone-100 px-3 py-2 rounded-lg text-xs flex-1 focus:outline-hidden focus:border-amber-400"
              />
              <button
                type="submit"
                className="bg-white text-stone-950 font-bold px-4 py-2 rounded-lg text-xs hover:bg-stone-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Unirme</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright & Payment Methods */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} NOMAD & CO. Studio. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] text-stone-400">
            <span>Klarna 3x</span>
            <span>·</span>
            <span>Apple Pay</span>
            <span>·</span>
            <span>Google Pay</span>
            <span>·</span>
            <span>Visa / Mastercard</span>
            <span>·</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
