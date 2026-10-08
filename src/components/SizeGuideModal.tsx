import React, { useState } from 'react';
import { X, Check, Ruler, Info } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productType: 'vestido' | 'pantalon' | 'calzado' | 'general';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  productType
}) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [height, setHeight] = useState<number>(172);
  const [weight, setWeight] = useState<number>(68);
  const [fitPreference, setFitPreference] = useState<'ajustado' | 'regular' | 'oversize'>('regular');
  const [calculatedSize, setCalculatedSize] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (productType === 'calzado') {
      // Shoe calculation based on foot length or estimate
      if (height < 162) setCalculatedSize('38 EU');
      else if (height < 170) setCalculatedSize('39 EU');
      else if (height < 178) setCalculatedSize('41 EU');
      else if (height < 185) setCalculatedSize('42 EU');
      else setCalculatedSize('44 EU');
    } else if (productType === 'pantalon') {
      if (weight < 58) setCalculatedSize(fitPreference === 'oversize' ? '30' : '28');
      else if (weight < 70) setCalculatedSize(fitPreference === 'oversize' ? '32' : '30');
      else if (weight < 82) setCalculatedSize(fitPreference === 'oversize' ? '34' : '32');
      else setCalculatedSize(fitPreference === 'oversize' ? '36' : '34');
    } else {
      // Tops / Dresses
      if (weight < 56) setCalculatedSize(fitPreference === 'oversize' ? 'S' : 'XS');
      else if (weight < 66) setCalculatedSize(fitPreference === 'oversize' ? 'M' : 'S');
      else if (weight < 76) setCalculatedSize(fitPreference === 'oversize' ? 'L' : 'M');
      else if (weight < 88) setCalculatedSize(fitPreference === 'oversize' ? 'XL' : 'L');
      else setCalculatedSize('XL');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-stone-800" />
            <h3 className="font-display text-lg font-semibold text-stone-900">
              Guía de Tallas Inteligente
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Unit switcher */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500">
              Medidas corporales exactas en reposo. Mantén la cinta recta.
            </p>
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  unit === 'cm' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500'
                }`}
              >
                CM
              </button>
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  unit === 'in' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500'
                }`}
              >
                PULGADAS (IN)
              </button>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="border border-stone-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left divide-y divide-stone-200">
              <thead className="bg-stone-100 text-stone-700 font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Talla</th>
                  {productType === 'calzado' ? (
                    <>
                      <th className="px-4 py-2.5">Longitud Pie ({unit})</th>
                      <th className="px-4 py-2.5">Equivalencia US</th>
                      <th className="px-4 py-2.5">Equivalencia UK</th>
                    </>
                  ) : productType === 'pantalon' ? (
                    <>
                      <th className="px-4 py-2.5">Cintura ({unit})</th>
                      <th className="px-4 py-2.5">Cadera ({unit})</th>
                      <th className="px-4 py-2.5">Largo Entrepierna ({unit})</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-2.5">Pecho ({unit})</th>
                      <th className="px-4 py-2.5">Cintura ({unit})</th>
                      <th className="px-4 py-2.5">Largo Total ({unit})</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white text-stone-600">
                {productType === 'calzado' ? (
                  [
                    { size: '37 EU', foot: unit === 'cm' ? '23.5 cm' : '9.2 in', us: '6.5 W / 5 M', uk: '4' },
                    { size: '38 EU', foot: unit === 'cm' ? '24.2 cm' : '9.5 in', us: '7.5 W / 6 M', uk: '5' },
                    { size: '39 EU', foot: unit === 'cm' ? '24.9 cm' : '9.8 in', us: '8.5 W / 7 M', uk: '6' },
                    { size: '40 EU', foot: unit === 'cm' ? '25.6 cm' : '10.1 in', us: '9 W / 7.5 M', uk: '6.5' },
                    { size: '41 EU', foot: unit === 'cm' ? '26.3 cm' : '10.3 in', us: '10 W / 8.5 M', uk: '7.5' },
                    { size: '42 EU', foot: unit === 'cm' ? '27.0 cm' : '10.6 in', us: '9.5 M', uk: '8.5' },
                    { size: '43 EU', foot: unit === 'cm' ? '27.7 cm' : '10.9 in', us: '10.5 M', uk: '9.5' },
                    { size: '44 EU', foot: unit === 'cm' ? '28.4 cm' : '11.2 in', us: '11.5 M', uk: '10.5' }
                  ].map((row) => (
                    <tr key={row.size} className="hover:bg-stone-50">
                      <td className="px-4 py-2 font-medium text-stone-900">{row.size}</td>
                      <td className="px-4 py-2">{row.foot}</td>
                      <td className="px-4 py-2">{row.us}</td>
                      <td className="px-4 py-2">{row.uk}</td>
                    </tr>
                  ))
                ) : productType === 'pantalon' ? (
                  [
                    { size: '28', w: unit === 'cm' ? '71-74' : '28-29', h: unit === 'cm' ? '88-91' : '35-36', l: unit === 'cm' ? '79' : '31' },
                    { size: '30', w: unit === 'cm' ? '76-79' : '30-31', h: unit === 'cm' ? '93-96' : '37-38', l: unit === 'cm' ? '80' : '31.5' },
                    { size: '32', w: unit === 'cm' ? '81-84' : '32-33', h: unit === 'cm' ? '98-101' : '39-40', l: unit === 'cm' ? '81' : '32' },
                    { size: '34', w: unit === 'cm' ? '86-89' : '34-35', h: unit === 'cm' ? '103-106' : '41-42', l: unit === 'cm' ? '82' : '32.5' },
                    { size: '36', w: unit === 'cm' ? '91-94' : '36-37', h: unit === 'cm' ? '108-111' : '43-44', l: unit === 'cm' ? '83' : '33' }
                  ].map((row) => (
                    <tr key={row.size} className="hover:bg-stone-50">
                      <td className="px-4 py-2 font-medium text-stone-900">{row.size}</td>
                      <td className="px-4 py-2">{row.w}</td>
                      <td className="px-4 py-2">{row.h}</td>
                      <td className="px-4 py-2">{row.l}</td>
                    </tr>
                  ))
                ) : (
                  [
                    { size: 'XS', chest: unit === 'cm' ? '80-84' : '31-33', waist: unit === 'cm' ? '60-64' : '24-25', len: unit === 'cm' ? '96' : '38' },
                    { size: 'S', chest: unit === 'cm' ? '85-89' : '33-35', waist: unit === 'cm' ? '65-69' : '26-27', len: unit === 'cm' ? '98' : '38.5' },
                    { size: 'M', chest: unit === 'cm' ? '90-95' : '35-37', waist: unit === 'cm' ? '70-75' : '28-29', len: unit === 'cm' ? '100' : '39.5' },
                    { size: 'L', chest: unit === 'cm' ? '96-102' : '38-40', waist: unit === 'cm' ? '76-82' : '30-32', len: unit === 'cm' ? '102' : '40' },
                    { size: 'XL', chest: unit === 'cm' ? '103-110' : '41-43', waist: unit === 'cm' ? '83-90' : '33-35', len: unit === 'cm' ? '104' : '41' }
                  ].map((row) => (
                    <tr key={row.size} className="hover:bg-stone-50">
                      <td className="px-4 py-2 font-medium text-stone-900">{row.size}</td>
                      <td className="px-4 py-2">{row.chest}</td>
                      <td className="px-4 py-2">{row.waist}</td>
                      <td className="px-4 py-2">{row.len}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Smart Fit Predictor */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-sm font-semibold text-stone-900">
                Recomendador de Calce NOMAD (Prueba en segundos)
              </h4>
            </div>

            <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-stone-600 mb-1">
                  Tu Altura (cm)
                </label>
                <input
                  type="number"
                  min="140"
                  max="210"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-hidden focus:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-600 mb-1">
                  Tu Peso (kg)
                </label>
                <input
                  type="number"
                  min="40"
                  max="140"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-hidden focus:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-600 mb-1">
                  ¿Cómo te gusta que te quede?
                </label>
                <select
                  value={fitPreference}
                  onChange={(e) => setFitPreference(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-hidden focus:border-stone-800"
                >
                  <option value="ajustado">Más ceñido / al cuerpo</option>
                  <option value="regular">Calce normal / estándar</option>
                  <option value="oversize">Oversize / desenfadado</option>
                </select>
              </div>

              <div className="sm:col-span-3 pt-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Calcular mi Talla Recomendada
                </button>
              </div>
            </form>

            {calculatedSize && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-950">
                      Tu talla sugerida para este modelo es: <span className="font-bold underline text-emerald-800">{calculatedSize}</span>
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      Calculado para silueta {fitPreference}. ¡Si te equivocas, el primer cambio es 100% gratuito!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick tips */}
          <div className="flex items-start gap-2 text-xs text-stone-500 pt-1">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <p>
              ¿Tienes dudas entre dos tallas? Para ropa informal (hoodies, cargos, vestidos camiseros), el 76% de nuestra comunidad prefiere una talla superior para lograr una silueta más relajada.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-stone-800 transition-colors"
          >
            Entendido, volver a la prenda
          </button>
        </div>
      </div>
    </div>
  );
};
