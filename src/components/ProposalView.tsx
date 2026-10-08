import React, { useState } from 'react';
import { 
  BRAND_INFO, 
  CATEGORIES_TREE, 
  PRODUCTS_CATALOG, 
  VISUAL_GUIDE_SHOTS, 
  PDP_STRUCTURE_BREAKDOWN 
} from '../data/fashionData';
import { 
  Compass, 
  FileText, 
  Camera, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShoppingBag,
  Sliders,
  Smartphone,
  Eye,
  AlertCircle
} from 'lucide-react';

interface ProposalViewProps {
  onNavigateToPDP: (productId: string) => void;
  onNavigateToCatalog: () => void;
}

export const ProposalView: React.FC<ProposalViewProps> = ({
  onNavigateToPDP,
  onNavigateToCatalog
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'arch' | 'pdp' | 'copy' | 'visual'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'mujer' | 'hombre' | 'calzado' | 'drops'>('mujer');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportFullProposal = () => {
    const markdownContent = `# PROPUESTA MAESTRA UX/UI & COPYWRITING - E-COMMERCE DE MODA INFORMAL Y CALZADO
Marca: ${BRAND_INFO.name}
Público Objetivo: ${BRAND_INFO.target}
Tono de Voz: ${BRAND_INFO.voice}

==================================================
1. ARQUITECTURA DE INFORMACIÓN Y CATEGORÍAS
==================================================
- Menú Principal: Mujer | Hombre | Calzado Urbano | Drops & Cápsulas
- Categorías cruzadas: Básicos Esenciales, Get The Look (Outfits), Eco-Conscious
- Facetas de búsqueda: Talla, Color, Calce (Fit), Rango de Precio, Ocasión.

==================================================
2. ESTRUCTURA DE LA FICHA DE PRODUCTO (PLANTILLA MAESTRA)
==================================================
${PDP_STRUCTURE_BREAKDOWN.map((p, i) => `${i + 1}. ${p.step}: ${p.rule} (Impacto: ${p.importance})`).join('\n')}

==================================================
3. EJEMPLOS DE DESCRIPCIONES DE PRODUCTO (COPYWRITING)
==================================================
${PRODUCTS_CATALOG.slice(0, 3).map((prod, i) => `
PRODUCTO ${i + 1}: ${prod.title}
Subtítulo: ${prod.subtitle}
Gancho: "${prod.hook}"
Historia: ${prod.storytelling}
Beneficios de Estilo:
- Cuándo usarlo: ${prod.styleBenefits.whenToWear}
- Cómo combinarlo: ${prod.styleBenefits.howToStyle}
- Sensación de confort: ${prod.styleBenefits.comfortVibe}
Ficha Técnica: ${prod.technicalSpecs.materials} | Calce: ${prod.technicalSpecs.fitType} | Origen: ${prod.technicalSpecs.origin}
Microcopy de Urgencia: ${prod.microcopyUrgency}
Cuidados: ${prod.careInstructions.join(', ')}
`).join('\n----------------------------------------\n')}

==================================================
4. ELEMENTOS VISUALES Y DIRECCIÓN DE ARTE E-COMMERCE
==================================================
${VISUAL_GUIDE_SHOTS.map(s => `
${s.title}
Objetivo: ${s.purpose}
Especificaciones: Ángulo: ${s.specs.angle} | Luz: ${s.specs.lighting} | Fondo: ${s.specs.background}
Dos: ${s.dos.join('; ')}
Don'ts: ${s.donts.join('; ')}
`).join('\n')}
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Propuesta_UX_UI_Copywriting_Nomad_${new Date().toISOString().split('T')[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Presentation Header */}
      <div className="relative rounded-2xl bg-stone-900 text-stone-100 p-8 sm:p-12 overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>Documento Maestro UX/UI & Dirección Creativa</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Estrategia de Catálogo Web, Arquitectura & Copywriting de Moda
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Propuesta integral diseñada para una marca de <strong>ropa informal y calzado urbano</strong> orientada a un público de <strong>16 a 40 años</strong>. Enfoque centrado en conversión (CRO), eliminación de dudas sobre tallas y copywriting emocional en tono juvenil y cercano.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportFullProposal}
              className="px-4 py-2 bg-white text-stone-900 hover:bg-stone-100 font-semibold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FileText className="w-4 h-4 text-stone-800" />
              Descargar Dossier Completo (.MD)
            </button>
            <button
              onClick={onNavigateToCatalog}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer border border-stone-700"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              Ver Tienda Simulada en Acción
            </button>
          </div>
        </div>

        {/* Brand Target Pill Badges - Clean metadata */}
        <div className="mt-8 pt-6 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-stone-400 block text-[11px]">Nicho</span>
            <strong className="text-stone-200">Ropa Informal & Zapatos</strong>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px]">Público Objetivo</span>
            <strong className="text-stone-200">16 a 40 años (Gen-Z & Millennial)</strong>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px]">Tono de Voz</span>
            <strong className="text-stone-200">Juvenil, Cercano & Auténtico</strong>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px]">Objetivo UX</span>
            <strong className="text-stone-200">Optimizado para Conversión</strong>
          </div>
        </div>
      </div>

      {/* Quick Jump Section Filter */}
      <div className="sticky top-20 z-20 bg-stone-50/90 backdrop-blur-md p-2 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'Ver Todo' },
            { id: 'arch', label: '1. Arquitectura & Menús' },
            { id: 'pdp', label: '2. Ficha Maestra PDP' },
            { id: 'copy', label: '3. Copywriting (3 Ejemplos)' },
            { id: 'visual', label: '4. Fotografía & Dirección Visual' }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. ARQUITECTURA DE INFORMACIÓN Y CATEGORÍAS */}
      {/* ======================================================== */}
      {(activeSection === 'all' || activeSection === 'arch') && (
        <section id="arquitectura" className="space-y-6">
          <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                Sección 1
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2">
                <Compass className="w-7 h-7 text-stone-800" />
                Arquitectura de Información & Árbol de Navegación
              </h2>
            </div>
            <button
              onClick={() => copyToClipboard(JSON.stringify(CATEGORIES_TREE, null, 2), 'arch-json')}
              className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 p-2 rounded-md hover:bg-stone-100 cursor-pointer"
              title="Copiar estructura JSON"
            >
              {copiedId === 'arch-json' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'arch-json' ? 'Copiado' : 'Copiar Estructura'}</span>
            </button>
          </div>

          <div className="prose max-w-none text-stone-700 text-sm leading-relaxed">
            <p>
              Para un público de <strong>16 a 40 años</strong> que compra moda informal y calzado desde el smartphone (más del 78% del tráfico), la navegación debe ser <strong>inmediata, con un máximo de 3 clics hacia cualquier producto</strong>. El árbol elimina etiquetas confusas o vocabulario de pasarela pretencioso y utiliza denominaciones claras, universales y cercanas.
            </p>
          </div>

          {/* Interactive Category Tree Explorer */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="font-display font-semibold text-stone-900 text-base">
                  Explorador Interactivo del Menú Principal
                </h3>
                <p className="text-xs text-stone-500">
                  Selecciona una categoría para ver sus subcategorías y enfoque de conversión.
                </p>
              </div>

              <div className="flex gap-1.5 bg-stone-100 p-1 rounded-lg">
                {(['mujer', 'hombre', 'calzado', 'drops'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedCategoryTab(tab)}
                    className={`px-3 py-1 text-xs font-semibold capitalize rounded-md transition-all cursor-pointer ${
                      selectedCategoryTab === tab
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategories Detailed Grid */}
            {(() => {
              const currentCat = CATEGORIES_TREE.find(c => c.id === selectedCategoryTab);
              if (!currentCat) return null;
              return (
                <div className="space-y-4">
                  <div className="p-3 bg-stone-50 rounded-lg flex items-center justify-between text-xs">
                    <span className="text-stone-700">
                      <strong>Categoría Maestra:</strong> {currentCat.name} — <em>{currentCat.description}</em>
                    </span>
                    <span className="text-stone-500 font-mono text-[11px]">Ruta: /{currentCat.slug}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentCat.subcategories.map((sub) => (
                      <div
                        key={sub.slug}
                        className="p-3.5 rounded-lg border border-stone-200/90 hover:border-stone-400 bg-white transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-stone-900">{sub.name}</h4>
                          {sub.popular && (
                            <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              Alto Volumen
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600 leading-snug">
                          {sub.description}
                        </p>
                        <div className="text-[10px] text-stone-400 font-mono pt-1">
                          /{currentCat.slug}/{sub.slug}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Key UX Architecture Principles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs">
                <Sliders className="w-4 h-4 text-stone-700" />
                <span>1. Búsqueda Facetada (Filtros Inteligentes)</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Filtros clave que no recargan la página: <strong>Talla disponible</strong> (para no ver prendas agotadas), <strong>Color</strong> con swatches, <strong>Calce/Fit</strong> (Oversize, Regular, Slim), y <strong>Rango de precio</strong> con sliders táctiles.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs">
                <Smartphone className="w-4 h-4 text-stone-700" />
                <span>2. Navegación Móvil para el Pulgar (Thumb Zone)</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                El 80% del público joven navega con una sola mano. Botón de menú y barra de filtros inferior fija (bottom sheet) accesible con el pulgar para evitar estirar la mano a la parte superior.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs">
                <Layers className="w-4 h-4 text-stone-700" />
                <span>3. Categoría Híbrida: "Calzado Urbano"</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                En moda juvenil, el calzado (sneakers) es el producto estrella con mayor ticket y recurrencia. Debe tener tanto sección independiente en el menú principal como visibilidad cruzada en Hombre y Mujer.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 2. ESTRUCTURA DE LA FICHA DE PRODUCTO (PLANTILLA MAESTRA) */}
      {/* ======================================================== */}
      {(activeSection === 'all' || activeSection === 'pdp') && (
        <section id="ficha-maestra" className="space-y-6 pt-4">
          <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                Sección 2
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-7 h-7 text-stone-800" />
                Estructura de la Ficha de Producto (Plantilla Maestra PDP)
              </h2>
            </div>
            <button
              onClick={() => onNavigateToPDP('vestido-sunday-chill')}
              className="text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Ver en Vivo en la PDP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm text-stone-700 leading-relaxed">
            La Ficha de Producto (PDP) es la página más crítica de todo el e-commerce: <strong>aquí se decide la compra</strong>. Esta plantilla universal optimiza la psicología de ventas mediante una jerarquía visual limpia, eliminación de puntos de fuga y reducción de devoluciones.
          </p>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PDP_STRUCTURE_BREAKDOWN.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-400 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-stone-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item.step}</span>
                  </h3>
                  <span className="text-[10px] text-stone-500 font-mono">Elemento #{index + 1}</span>
                </div>
                <p className="text-xs text-stone-700">
                  <strong className="text-stone-900">Regla de diseño:</strong> {item.rule}
                </p>
                <p className="text-[11px] text-stone-500 italic">
                  💡 {item.importance}
                </p>
              </div>
            ))}
          </div>

          {/* Formula Callout */}
          <div className="p-5 bg-stone-100 rounded-xl border border-stone-300 space-y-3">
            <h3 className="font-display font-semibold text-stone-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Fórmula de Titulación Persuasiva para Moda Informal:
            </h3>
            <div className="p-3 bg-white rounded-lg border border-stone-200 font-mono text-xs text-stone-800">
              [Tipo de Prenda] + [Corte / Fit Característico] + ["Nombre Icónico de Colección"] + [Detalle Técnico / Material Noble]
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-600 pt-1">
              <div>
                <span className="text-stone-400 block text-[10px]">Ejemplo 1 (Vestido):</span>
                <strong>Vestido Camisero Oversize "Sunday Chill" en Lino y Algodón</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Ejemplo 2 (Jean):</span>
                <strong>Jean Cargo Relaxed Fit "Nomad '98" en Denim 13.5 oz</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Ejemplo 3 (Zapatillas):</span>
                <strong>Sneakers Urbanos Retro Court "Subway '88" en Cuero Vacuno</strong>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 3. EJEMPLOS DE DESCRIPCIONES DE PRODUCTOS (COPYWRITING) */}
      {/* ======================================================== */}
      {(activeSection === 'all' || activeSection === 'copy') && (
        <section id="copywriting" className="space-y-6 pt-4">
          <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                Sección 3
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-7 h-7 text-stone-800" />
                Ejemplos Listos para Producción (Copywriting de Conversión)
              </h2>
            </div>
          </div>

          <p className="text-sm text-stone-700 leading-relaxed">
            Redacción estructurada con la fórmula <strong>Gancho Emocional + Storytelling Cotidiano + Beneficios de Estilo + Especificaciones Técnicas Breves + Microcopy de Urgencia</strong>, redactada exactamente para el público de 16 a 40 años con tono fresco y cercano.
          </p>

          {/* The 3 requested products copywriting cards */}
          <div className="space-y-6">
            {PRODUCTS_CATALOG.slice(0, 3).map((prod, idx) => {
              const fullCopyText = `Título: ${prod.title}
Subtítulo: ${prod.subtitle}
Gancho: "${prod.hook}"

Historia & Por qué te va a encantar:
${prod.storytelling}

Beneficios de Estilo:
- Cuándo llevarlo: ${prod.styleBenefits.whenToWear}
- Cómo combinarlo: ${prod.styleBenefits.howToStyle}
- Sensación de confort: ${prod.styleBenefits.comfortVibe}

Ficha Técnica:
- Composición: ${prod.technicalSpecs.materials}
- Calce: ${prod.technicalSpecs.fitType}
- Fabricación: ${prod.technicalSpecs.origin}

Cuidados:
${prod.careInstructions.map(c => `- ${c}`).join('\n')}

Microcopy de Conversión: ${prod.microcopyUrgency}`;

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs"
                >
                  {/* Card Header */}
                  <div className="p-5 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        0{idx + 1}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-stone-900 text-base">
                          {prod.title}
                        </h3>
                        <p className="text-xs text-stone-500">
                          {idx === 0 ? 'Enfoque: Comodidad y estilo de temporada' : idx === 1 ? 'Enfoque: Durabilidad y ajuste perfecto' : 'Enfoque: Versatilidad y tendencia'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(fullCopyText, `copy-${prod.id}`)}
                        className="px-3 py-1.5 text-xs font-semibold bg-white border border-stone-300 rounded-lg text-stone-700 hover:text-stone-900 hover:border-stone-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedId === `copy-${prod.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Texto Completo</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onNavigateToPDP(prod.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Ver Ficha Interactiva</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Copy Breakdown */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Thumbnail & Microcopy */}
                    <div className="lg:col-span-4 space-y-4">
                      <img
                        src={prod.heroImage}
                        alt={prod.title}
                        className="w-full aspect-4/5 object-cover rounded-lg border border-stone-200"
                      />
                      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1">
                        <span className="font-bold text-amber-900 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Gatillo de Urgencia Ética:
                        </span>
                        <p className="text-amber-800">{prod.microcopyUrgency}</p>
                      </div>
                    </div>

                    {/* Right: Detailed Text Sections */}
                    <div className="lg:col-span-8 space-y-4 text-xs">
                      {/* Hook */}
                      <div className="p-3.5 bg-stone-100 rounded-lg border-l-4 border-stone-900 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                          Gancho Emocional (Above the fold)
                        </span>
                        <p className="text-sm font-medium text-stone-900 italic">
                          "{prod.hook}"
                        </p>
                      </div>

                      {/* Storytelling */}
                      <div className="space-y-1">
                        <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wider">
                          Storytelling de la prenda (Conexión humana)
                        </span>
                        <p className="text-stone-700 leading-relaxed text-xs">
                          {prod.storytelling}
                        </p>
                      </div>

                      {/* Style Benefits */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-stone-100">
                        <div className="p-2.5 bg-stone-50 rounded-lg">
                          <strong className="block text-stone-900 text-[11px] mb-0.5">Cuándo llevarlo:</strong>
                          <span className="text-stone-600 text-[11px] leading-snug">{prod.styleBenefits.whenToWear}</span>
                        </div>
                        <div className="p-2.5 bg-stone-50 rounded-lg">
                          <strong className="block text-stone-900 text-[11px] mb-0.5">Cómo combinarlo:</strong>
                          <span className="text-stone-600 text-[11px] leading-snug">{prod.styleBenefits.howToStyle}</span>
                        </div>
                        <div className="p-2.5 bg-stone-50 rounded-lg">
                          <strong className="block text-stone-900 text-[11px] mb-0.5">Sensación al cuerpo:</strong>
                          <span className="text-stone-600 text-[11px] leading-snug">{prod.styleBenefits.comfortVibe}</span>
                        </div>
                      </div>

                      {/* Technical Specs & Care */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                        <div>
                          <strong className="block text-stone-900 text-[11px] mb-1">Detalles Técnicos:</strong>
                          <ul className="space-y-1 text-stone-600 text-[11px]">
                            <li>· <strong className="text-stone-700">Material:</strong> {prod.technicalSpecs.materials}</li>
                            <li>· <strong className="text-stone-700">Calce:</strong> {prod.technicalSpecs.fitType}</li>
                            <li>· <strong className="text-stone-700">Origen:</strong> {prod.technicalSpecs.origin}</li>
                          </ul>
                        </div>
                        <div>
                          <strong className="block text-stone-900 text-[11px] mb-1">Guía Rápida de Cuidados:</strong>
                          <ul className="space-y-1 text-stone-600 text-[11px]">
                            {prod.careInstructions.map((c, i) => (
                              <li key={i}>· {c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Copy Comparison Table: Boring vs High-Converting */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <h3 className="font-display font-semibold text-stone-900 text-sm">
              Comparativa: Copy de Tienda Genérica vs. Copy de Conversión NOMAD (16 a 40 años)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-lg space-y-2">
                <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>❌ Copy Aburrido / Tradicional (Baja Conversión):</span>
                </div>
                <p className="text-stone-700 italic">
                  "Pantalón vaquero tipo cargo con bolsillos laterales. Composición 99% algodón. Cierre con cremallera y botón. Lavar a máquina."
                </p>
                <p className="text-[11px] text-rose-900">
                  <strong>Por qué fracasa:</strong> Frío, puramente descriptivo, no despierta deseo ni resuelve el miedo al mal ajuste o rigidez.
                </p>
              </div>

              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✅ Copy Persuasivo NOMAD (Alta Conversión):</span>
                </div>
                <p className="text-stone-800 italic">
                  "Olvídate de los vaqueros tiesos e incómodos. Diseñado en denim resistente de 13.5 oz con 1% de elastano técnico para que vivas en él. Seis bolsillos reales donde tu teléfono cabe de verdad sin abultar."
                </p>
                <p className="text-[11px] text-emerald-950">
                  <strong>Por qué vende:</strong> Empatiza con un problema real, resalta beneficios sensoriales y comunica utilidad tangible.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 4. ELEMENTOS VISUALES Y RECOMENDACIONES DE DISEÑO */}
      {/* ======================================================== */}
      {(activeSection === 'all' || activeSection === 'visual') && (
        <section id="elementos-visuales" className="space-y-6 pt-4">
          <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                Sección 4
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2">
                <Camera className="w-7 h-7 text-stone-800" />
                Elementos Visuales & Protocolo Fotográfico E-commerce
              </h2>
            </div>
          </div>

          <p className="text-sm text-stone-700 leading-relaxed">
            En un e-commerce de moda, el 93% de la decisión de compra inicial depende de la calidad visual. Para moda informal y calzado dirigido a personas de 16 a 40 años, estas son las <strong>6 tomas obligatorias</strong> que debe tener cada ficha de producto:
          </p>

          {/* 6 Mandatory Photo Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {VISUAL_GUIDE_SHOTS.map((shot) => (
              <div
                key={shot.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                    <img
                      src={shot.exampleImage}
                      alt={shot.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      Toma Obligatoria
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <h3 className="font-display font-bold text-stone-900 text-sm">
                      {shot.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {shot.purpose}
                    </p>

                    <div className="p-2.5 bg-stone-50 rounded-lg text-[11px] text-stone-700 space-y-1 border border-stone-200/80">
                      <div><strong className="text-stone-900">Ángulo:</strong> {shot.specs.angle}</div>
                      <div><strong className="text-stone-900">Iluminación:</strong> {shot.specs.lighting}</div>
                      <div><strong className="text-stone-900">Fondo:</strong> {shot.specs.background}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-2 text-[11px]">
                  <div className="text-emerald-700 font-medium">
                    ✓ <strong>Lo que debes hacer:</strong> {shot.dos[0]}
                  </div>
                  <div className="text-rose-700 font-medium">
                    ✗ <strong>Evitar:</strong> {shot.donts[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Specs for Web Performance */}
          <div className="bg-stone-900 text-stone-100 rounded-xl p-6 space-y-4">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Estándar Técnico de Exportación para la Web (Zero Latency)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-stone-800 rounded-lg border border-stone-700">
                <span className="text-stone-400 block text-[11px]">Proporción / Aspect Ratio</span>
                <strong className="text-stone-100 text-sm">4:5 Vertical</strong>
                <p className="text-[10px] text-stone-400 mt-0.5">Optimizado para smartphones y feed de redes.</p>
              </div>

              <div className="p-3 bg-stone-800 rounded-lg border border-stone-700">
                <span className="text-stone-400 block text-[11px]">Resolución Máxima</span>
                <strong className="text-stone-100 text-sm">1200 x 1500 px</strong>
                <p className="text-[10px] text-stone-400 mt-0.5">Permite zoom de tela sin ralentizar la carga.</p>
              </div>

              <div className="p-3 bg-stone-800 rounded-lg border border-stone-700">
                <span className="text-stone-400 block text-[11px]">Formatos Modernos</span>
                <strong className="text-stone-100 text-sm">WebP & AVIF</strong>
                <p className="text-[10px] text-stone-400 mt-0.5">Ahorra hasta un 65% de peso frente a JPEG.</p>
              </div>

              <div className="p-3 bg-stone-800 rounded-lg border border-stone-700">
                <span className="text-stone-400 block text-[11px]">Peso por Imagen</span>
                <strong className="text-stone-100 text-sm">&lt; 150 KB</strong>
                <p className="text-[10px] text-stone-400 mt-0.5">LCP menor a 1.2 segundos en conexiones 4G/5G.</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
