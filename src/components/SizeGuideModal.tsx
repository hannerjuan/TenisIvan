import React, { useEffect, useState } from 'react';
import { X, Ruler, Check } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Foot length (cm) that each Colombian size fits, with EU/US equivalents
const SIZE_CHART = [
  { col: '35', eu: '36', us: '4.5', cm: 22.5 },
  { col: '36', eu: '37', us: '5', cm: 23.5 },
  { col: '37', eu: '38', us: '6', cm: 24 },
  { col: '38', eu: '39', us: '6.5', cm: 25 },
  { col: '39', eu: '40', us: '7', cm: 25.5 },
  { col: '40', eu: '41', us: '8', cm: 26.5 },
  { col: '41', eu: '42', us: '8.5', cm: 27 },
  { col: '42', eu: '43', us: '9.5', cm: 28 },
  { col: '43', eu: '44', us: '10', cm: 28.5 },
  { col: '44', eu: '45', us: '11', cm: 29.5 }
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [footLength, setFootLength] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cm = parseFloat(footLength.replace(',', '.'));
  const recommended = Number.isFinite(cm) && cm > 0
    ? SIZE_CHART.find((row) => cm <= row.cm) ?? SIZE_CHART[SIZE_CHART.length - 1]
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        className="w-full max-w-lg bg-cream rounded-[2rem] border-2 border-ink shadow-pop-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-ink bg-sun">
          <h2 id="size-guide-title" className="font-display text-2xl font-extrabold flex items-center gap-2">
            <Ruler className="w-6 h-6" />
            Encuentra tu talla
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border-2 border-ink flex items-center justify-center hover:rotate-90 transition-transform cursor-pointer"
            aria-label="Cerrar guía de tallas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          <ol className="text-sm space-y-1 list-decimal pl-5 text-ink/80">
            <li>Pon una hoja en el suelo junto a la pared y apoya el talón en ella.</li>
            <li>Marca la punta de tu dedo más largo y mide en centímetros.</li>
            <li>Mide los dos pies y usa la medida mayor.</li>
          </ol>

          <label className="block space-y-1.5">
            <span className="text-sm font-extrabold">Largo de tu pie (cm)</span>
            <input
              type="number"
              inputMode="decimal"
              min="20"
              max="32"
              step="0.1"
              placeholder="Ej. 25.5"
              value={footLength}
              onChange={(e) => setFootLength(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-ink rounded-2xl text-lg font-bold focus:outline-hidden focus:shadow-pop-sm"
            />
          </label>

          {recommended && (
            <p className="p-4 bg-lime border-2 border-ink rounded-2xl font-bold flex items-center gap-2" role="status">
              <Check className="w-5 h-5 shrink-0" strokeWidth={3} />
              Tu talla colombiana es la <span className="font-display text-2xl font-extrabold">{recommended.col}</span> (EU {recommended.eu})
            </p>
          )}

          <table className="w-full text-sm text-center border-2 border-ink rounded-2xl overflow-hidden border-separate border-spacing-0">
            <thead className="bg-ink text-white">
              <tr>
                <th className="py-2">COL</th>
                <th className="py-2">EU</th>
                <th className="py-2">US</th>
                <th className="py-2">Pie (cm)</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row) => (
                <tr key={row.col} className={recommended?.col === row.col ? 'bg-lime font-extrabold' : 'odd:bg-white'}>
                  <td className="py-1.5">{row.col}</td>
                  <td className="py-1.5">{row.eu}</td>
                  <td className="py-1.5">{row.us}</td>
                  <td className="py-1.5">{row.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-ink/60">Si estás entre dos tallas, elige la mayor.</p>
        </div>
      </div>
    </div>
  );
};
