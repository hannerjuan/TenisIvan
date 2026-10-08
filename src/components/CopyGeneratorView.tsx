import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Wand2, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface CopyGeneratorViewProps {
  onLoadIntoPDP: (customProduct: Product) => void;
}

export const CopyGeneratorView: React.FC<CopyGeneratorViewProps> = ({
  onLoadIntoPDP
}) => {
  const [garmentType, setGarmentType] = useState('Hoodie oversize de algodón');
  const [material, setMaterial] = useState('100% Algodón orgánico peinado (420 GSM)');
  const [vibe, setVibe] = useState('Desenfadado, streetwear limpio, para el día a día');
  const [keyFeatures, setKeyFeatures] = useState('Capucha doble forrada, sin cordones molestos, tacto afelpado');
  const [price, setPrice] = useState('59.95');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Generated output state
  const [generatedSheet, setGeneratedSheet] = useState({
    title: 'Hoodie Boxy Oversize "Daily Cloud" en Algodón Orgánico 420 GSM',
    subtitle: 'Felpa perchada de alto gramaje con capucha estructurada y tacto melocotón',
    hook: 'La sudadera que te pones un domingo por la mañana y no te quitas hasta el viernes.',
    storytelling: 'Encontrar el equilibrio entre una sudadera que abrigue de verdad y que no pierda su forma con los lavados no es casualidad: es pura obsesión por el tejido. Confeccionada con 420 gramos de algodón peinado, Daily Cloud tiene esa caída sólida y relajada que eleva cualquier pantalón básico sin esfuerzo.',
    whenToWear: 'Ideal para jornadas de teletrabajo, paseos por la ciudad con café en mano y tardes de frío donde buscas máximo confort sin parecer desaliñado.',
    howToStyle: 'Combínalo con un pantalón cargo holgado o vaqueros rectos y zapatillas retro. En días de más frío, luce genial debajo de una sobrecamisa abierta o una cazadora bomber.',
    comfortVibe: 'Interior afelpado ultrasuave y capucha envolvente sin cordones rígidos.',
    technicalSpecs: '100% Algodón orgánico certificado GOTS. Gramaje 420 GSM. Ribetes de puño y cintura reforzados con elastano.',
    careInstructions: 'Lavar en frío a 30°C del revés. No usar secadora para preservar la felpa. Secar en plano.',
    microcopyUrgency: '⚡ Edición limitada de temporada. Envío express gratis a partir de $49.'
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    // Deterministic persuasive copywriting algorithm tailored for 16-40 informal fashion
    const cleanType = garmentType.trim();
    const cleanMat = material.trim();
    const cleanVibe = vibe.trim();

    const title = `${cleanType} "${cleanType.split(' ')[0]} Studio '26" en ${cleanMat.split(' ')[0] || 'Tejido Premium'}`;
    const subtitle = `${cleanMat} con corte ergonómico diseñado para moverte en libertad`;
    const hook = `Esa prenda que te pones en 20 segundos y que transforma al instante cualquier outfit básico.`;
    const storytelling = `Diseñado pensando en tu rutina real: sin artificios incómodos ni telas rígidas que te aten. Rescatamos la esencia del estilo informal para ofrecerte una prenda que respira contigo, resiste el ritmo de la calle y mantiene su textura impecable lavado tras lavado.`;
    const whenToWear = `Perfecto para tu día a día: desde clases o trabajo creativo hasta escapadas de fin de semana con amigos.`;
    const howToStyle = `Llévalo con tus zapatillas favoritas y jeans relaxed fit para un rollo urbano impecable, o suma una prenda exterior en capas para elevar el look.`;
    const comfortVibe = `Tacto sumamente suave con ajuste relajado que no oprime ni restringe tus movimientos.`;
    const technicalSpecs = `${cleanMat}. Costuras dobles reforzadas. Procesos de confección ética de bajo impacto hídrico.`;
    const careInstructions = `Lavar a máquina a 30°C con colores afines. Colgar al aire. No requiere planchado agresivo.`;
    const microcopyUrgency = `🔥 Gran demanda esta semana. Pruébatelo en casa y si no es tu talla, el cambio es 100% gratis.`;

    setGeneratedSheet({
      title,
      subtitle,
      hook,
      storytelling,
      whenToWear,
      howToStyle,
      comfortVibe,
      technicalSpecs,
      careInstructions,
      microcopyUrgency
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const fullCopyText = `TÍTULO: ${generatedSheet.title}
SUBTÍTULO: ${generatedSheet.subtitle}
GANCHO: "${generatedSheet.hook}"

HISTORIA & STORYTELLING:
${generatedSheet.storytelling}

BENEFICIOS DE ESTILO:
- Cuándo llevarlo: ${generatedSheet.whenToWear}
- Cómo combinarlo: ${generatedSheet.howToStyle}
- Sensación de confort: ${generatedSheet.comfortVibe}

ESPECIFICACIONES TÉCNICAS:
${generatedSheet.technicalSpecs}

CUIDADOS:
${generatedSheet.careInstructions}

MICROCOPY DE URGENCIA / CONFIANZA:
${generatedSheet.microcopyUrgency}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Herramienta Interactiva de Conversión</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-stone-900 tracking-tight">
          Generador de Fichas de Producto & Copywriting
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          Genera instantáneamente descripciones de producto listas para publicar en tu tienda. Ajustado al tono juvenil, cercano y persuasivo de NOMAD (16-40 años).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="font-display font-semibold text-stone-900 text-sm">
              Datos de la Prenda a Redactar
            </h2>
            <span className="text-[11px] text-stone-400 font-mono">Modo: Moda Informal</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Tipo de prenda o calzado:
              </label>
              <input
                type="text"
                value={garmentType}
                onChange={(e) => setGarmentType(e.target.value)}
                placeholder="Ej. Sobrecamisa de pana, Sneakers de lona..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Composición / Materiales destacados:
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Ej. 100% Algodón, Denim 13oz, Piel vacuna..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Estilo / Ocasión / Vibe deseado:
              </label>
              <input
                type="text"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="Ej. Streetwear relajado, para todo el día, fresco..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 text-stone-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Detalles únicos que enamoran:
              </label>
              <input
                type="text"
                value={keyFeatures}
                onChange={(e) => setKeyFeatures(e.target.value)}
                placeholder="Ej. Bolsillos profundos, costuras dobles, sin botones molestos..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 text-stone-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Precio objetivo ($):
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 text-stone-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Wand2 className="w-4 h-4 text-amber-400" />
              Generar Ficha Persuasiva Completa
            </button>
          </form>

          {/* Preset Buttons for Quick Testing */}
          <div className="pt-2 border-t border-stone-100">
            <span className="text-[11px] text-stone-400 block mb-2 font-medium">
              O prueba un preset rápido:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Cazadora Denim', type: 'Cazadora Denim Oversize Raw', mat: '100% Algodón Denim rígido 14oz', vibe: 'Retro 90s resistente' },
                { label: 'Camiseta Boxy', type: 'Camiseta Boxy Fit Heavyweight', mat: '100% Algodón orgánico 260 GSM', vibe: 'Básico imprescindible' },
                { label: 'Retro Runner', type: 'Sneakers Retro Runner \'92', mat: 'Gamuza suave y malla transpirable', vibe: 'Comodidad urbana todoterreno' }
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setGarmentType(preset.type);
                    setMaterial(preset.mat);
                    setVibe(preset.vibe);
                  }}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-[11px] transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output: Ready-to-use Master Sheet */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-6 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <h2 className="font-display font-semibold text-stone-900 text-sm">
                  Ficha Generada Lista para Publicar
                </h2>
              </div>

              <button
                onClick={() => copyToClipboard(fullCopyText, 'full-generated')}
                className="px-3 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSection === 'full-generated' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Ficha Completa</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Breakdown */}
            <div className="space-y-4 text-xs">
              {/* Title & Subtitle */}
              <div className="p-3 bg-stone-50 rounded-lg space-y-1 border border-stone-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Título Persuasivo
                </span>
                <h3 className="font-display font-bold text-stone-900 text-base leading-snug">
                  {generatedSheet.title}
                </h3>
                <p className="text-stone-600 text-xs">{generatedSheet.subtitle}</p>
              </div>

              {/* Hook */}
              <div className="p-3 bg-stone-100 rounded-lg border-l-4 border-stone-900 space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                  Gancho de Conversión (Above The Fold)
                </span>
                <p className="text-xs text-stone-900 font-medium italic">
                  "{generatedSheet.hook}"
                </p>
              </div>

              {/* Storytelling */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  Storytelling Cotidiano
                </span>
                <p className="text-stone-700 leading-relaxed">
                  {generatedSheet.storytelling}
                </p>
              </div>

              {/* Style Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-stone-100">
                <div className="p-2.5 bg-stone-50 rounded-lg">
                  <strong className="block text-stone-900 text-[11px] mb-0.5">Cuándo llevarlo:</strong>
                  <span className="text-stone-600 text-[11px] leading-snug">{generatedSheet.whenToWear}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg">
                  <strong className="block text-stone-900 text-[11px] mb-0.5">Cómo combinarlo:</strong>
                  <span className="text-stone-600 text-[11px] leading-snug">{generatedSheet.howToStyle}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg">
                  <strong className="block text-stone-900 text-[11px] mb-0.5">Sensación al cuerpo:</strong>
                  <span className="text-stone-600 text-[11px] leading-snug">{generatedSheet.comfortVibe}</span>
                </div>
              </div>

              {/* Specs & Microcopy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                <div className="p-2.5 bg-stone-50 rounded-lg space-y-1">
                  <strong className="text-stone-900 text-[11px] block">Detalles Técnicos:</strong>
                  <p className="text-stone-600 text-[11px]">{generatedSheet.technicalSpecs}</p>
                </div>
                <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg space-y-1">
                  <strong className="text-amber-950 text-[11px] block">Microcopy de Conversión:</strong>
                  <p className="text-amber-800 text-[11px]">{generatedSheet.microcopyUrgency}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>Optimizado para tasa de retención y reducción de rebote en móviles.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
