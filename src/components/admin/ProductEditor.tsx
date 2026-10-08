import React, { useRef, useState } from 'react';
import { ArrowLeft, ImagePlus, Loader2, Plus, Trash2, X, ChevronLeft } from 'lucide-react';
import type { Gender, Product, ProductColor } from '../../types';
import { CARD_COLORS, COL_SIZES, SNEAKER_STYLES } from '../../data/catalog';
import { adminApi, resizeImage } from './adminApi';

interface ProductEditorProps {
  token: string;
  product: Product | null;
  onCancel: () => void;
  onSaved: (products: Product[]) => void;
}

const newColorId = () => `color-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;

const emptyProduct = (): Product => ({
  id: '',
  title: '',
  subtitle: '',
  category: SNEAKER_STYLES[0].slug,
  targetGender: 'Unisex',
  price: 0,
  cardColor: CARD_COLORS[0],
  description: '',
  colors: [{ id: newColorId(), name: '', colorHex: '#ffffff', images: [] }],
  sizes: [...COL_SIZES],
  stock: {},
  published: false
});

const inputClass = 'w-full px-4 py-2.5 bg-white border-2 border-ink rounded-2xl focus:outline-hidden focus:shadow-pop-sm';
const sectionClass = 'p-5 sm:p-6 bg-white border-2 border-ink rounded-3xl space-y-4';

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode; className?: string }> = ({ label, hint, children, className = '' }) => (
  <label className={`block space-y-1.5 ${className}`}>
    <span className="text-sm font-extrabold">{label}</span>
    {children}
    {hint && <span className="block text-xs text-ink/60">{hint}</span>}
  </label>
);

export const ProductEditor: React.FC<ProductEditorProps> = ({ token, product, onCancel, onSaved }) => {
  const [draft, setDraft] = useState<Product>(() => (product ? structuredClone(product) : emptyProduct()));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingColor, setUploadingColor] = useState<string | null>(null);
  const [fillValue, setFillValue] = useState('');
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const set = <K extends keyof Product>(key: K, value: Product[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const updateColor = (colorId: string, patch: Partial<ProductColor>) =>
    setDraft((d) => ({ ...d, colors: d.colors.map((c) => (c.id === colorId ? { ...c, ...patch } : c)) }));

  const addColor = () => setDraft((d) => ({ ...d, colors: [...d.colors, { id: newColorId(), name: '', colorHex: '#ffffff', images: [] }] }));

  const removeColor = (colorId: string) =>
    setDraft((d) => {
      const { [colorId]: _removed, ...stock } = d.stock;
      return { ...d, colors: d.colors.filter((c) => c.id !== colorId), stock };
    });

  const toggleSize = (size: string) =>
    setDraft((d) => ({
      ...d,
      sizes: d.sizes.includes(size) ? d.sizes.filter((s) => s !== size) : COL_SIZES.filter((s) => s === size || d.sizes.includes(s))
    }));

  const setUnits = (colorId: string, size: string, value: string) => {
    const units = Math.max(0, Math.floor(Number(value) || 0));
    setDraft((d) => ({ ...d, stock: { ...d.stock, [colorId]: { ...d.stock[colorId], [size]: units } } }));
  };

  const fillAllStock = () => {
    const units = Math.max(0, Math.floor(Number(fillValue) || 0));
    setDraft((d) => ({
      ...d,
      stock: Object.fromEntries(d.colors.map((c) => [c.id, Object.fromEntries(d.sizes.map((s) => [s, units]))]))
    }));
  };

  const totalUnits = draft.colors.reduce((acc, c) => acc + draft.sizes.reduce((sum, s) => sum + (draft.stock[c.id]?.[s] ?? 0), 0), 0);

  const uploadImages = async (colorId: string, files: FileList | null) => {
    if (!files?.length) return;
    setUploadingColor(colorId);
    setError('');
    try {
      for (const file of Array.from(files)) {
        const { url } = await adminApi.uploadImage(token, await resizeImage(file));
        setDraft((d) => ({ ...d, colors: d.colors.map((c) => (c.id === colorId ? { ...c, images: [...c.images, url] } : c)) }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la foto.');
    } finally {
      setUploadingColor(null);
      const input = fileInputs.current[colorId];
      if (input) input.value = '';
    }
  };

  const addImageUrl = (colorId: string, url: string) => {
    const clean = url.trim();
    if (!/^https:\/\//.test(clean)) {
      setError('El enlace de la foto debe empezar por https://');
      return false;
    }
    updateColor(colorId, { images: [...(draft.colors.find((c) => c.id === colorId)?.images ?? []), clean] });
    setError('');
    return true;
  };

  const moveImageFirst = (colorId: string, index: number) => {
    const color = draft.colors.find((c) => c.id === colorId);
    if (!color || index === 0) return;
    const images = [...color.images];
    const [image] = images.splice(index, 1);
    updateColor(colorId, { images: [image, ...images] });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { products } = await adminApi.saveProduct(token, draft);
      onSaved(products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  };

  const errorBox = error && (
    <p className="p-4 bg-bubble-soft border-2 border-ink rounded-2xl font-bold" role="alert">
      {error}
    </p>
  );

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-sm font-extrabold bg-white border-2 border-ink rounded-full pl-2 pr-4 py-1.5 hover:shadow-pop-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={3} /> Volver a productos
        </button>
        <h2 className="font-display text-3xl font-extrabold">{product ? `Editar ${product.title}` : 'Nuevo producto'}</h2>
      </div>

      {errorBox}

      {/* Basics */}
      <section className={sectionClass}>
        <h3 className="font-display text-2xl font-extrabold">Información</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre *" className="sm:col-span-2">
            <input required maxLength={80} value={draft.title} onChange={(e) => set('title', e.target.value)} className={inputClass} placeholder="Ej. Flux Runner" />
          </Field>
          <Field label="Descripción corta" hint="Se ve debajo del nombre y en las tarjetas." className="sm:col-span-2">
            <input maxLength={140} value={draft.subtitle} onChange={(e) => set('subtitle', e.target.value)} className={inputClass} placeholder="Ej. Malla ligera y espuma reactiva para correr" />
          </Field>
          <Field label="Estilo">
            <select value={draft.category} onChange={(e) => set('category', e.target.value)} className={inputClass}>
              {SNEAKER_STYLES.map((s) => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Para">
            <select value={draft.targetGender} onChange={(e) => set('targetGender', e.target.value as Gender)} className={inputClass}>
              <option value="Unisex">Unisex</option>
              <option value="Mujer">Mujer</option>
              <option value="Hombre">Hombre</option>
            </select>
          </Field>
          <Field label="Precio (COP) *">
            <input required type="number" min={1} step={1} inputMode="numeric" value={draft.price || ''} onChange={(e) => set('price', Number(e.target.value))} className={inputClass} placeholder="Ej. 479900" />
          </Field>
          <Field label="Precio anterior (COP)" hint="Opcional. Si lo pones, se muestra tachado como descuento.">
            <input type="number" min={1} step={1} inputMode="numeric" value={draft.originalPrice ?? ''} onChange={(e) => set('originalPrice', e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
          </Field>
          <Field label="Etiqueta" hint="Opcional, ej. Nuevo, Edición limitada.">
            <input maxLength={24} value={draft.badge ?? ''} onChange={(e) => set('badge', e.target.value || undefined)} className={inputClass} />
          </Field>
          <fieldset className="space-y-1.5">
            <legend className="text-sm font-extrabold">Color de la tarjeta</legend>
            <div className="flex flex-wrap gap-2">
              {CARD_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => set('cardColor', color)}
                  className={`w-10 h-10 rounded-full border-2 border-ink cursor-pointer ${draft.cardColor === color ? 'ring-4 ring-grape ring-offset-2' : ''}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Color de tarjeta ${color}`}
                  aria-pressed={draft.cardColor === color}
                />
              ))}
            </div>
          </fieldset>
        </div>
        <div className="flex flex-wrap gap-6 pt-2">
          <label className="inline-flex items-center gap-2 font-bold cursor-pointer">
            <input type="checkbox" checked={draft.published} onChange={(e) => set('published', e.target.checked)} className="w-5 h-5 accent-grape" />
            Publicado (visible en la tienda)
          </label>
          <label className="inline-flex items-center gap-2 font-bold cursor-pointer">
            <input type="checkbox" checked={Boolean(draft.featured)} onChange={(e) => set('featured', e.target.checked)} className="w-5 h-5 accent-grape" />
            Destacar en el inicio
          </label>
        </div>
      </section>

      {/* Colours and photos */}
      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-extrabold">Colores y fotos</h3>
          <button type="button" onClick={addColor} disabled={draft.colors.length >= 8} className="inline-flex items-center gap-1.5 px-4 py-2 bg-lime border-2 border-ink rounded-full font-extrabold cursor-pointer disabled:opacity-50">
            <Plus className="w-4 h-4" /> Agregar color
          </button>
        </div>
        <p className="text-sm text-ink/60">La primera foto de cada color es la principal. Las fotos se reducen automáticamente antes de subirse.</p>

        <div className="space-y-4">
          {draft.colors.map((color, colorIndex) => (
            <div key={color.id} className="p-4 bg-cream border-2 border-ink rounded-2xl space-y-3">
              <div className="flex flex-wrap items-end gap-3">
                <Field label={`Color ${colorIndex + 1} *`} className="flex-1 min-w-48">
                  <input required maxLength={40} value={color.name} onChange={(e) => updateColor(color.id, { name: e.target.value })} className={inputClass} placeholder="Ej. Rojo Fuego" />
                </Field>
                <Field label="Tono">
                  <input type="color" value={color.colorHex} onChange={(e) => updateColor(color.id, { colorHex: e.target.value })} className="w-14 h-11 rounded-xl border-2 border-ink cursor-pointer bg-white" />
                </Field>
                {draft.colors.length > 1 && (
                  <button type="button" onClick={() => removeColor(color.id)} className="h-11 px-3 inline-flex items-center gap-1 rounded-2xl border-2 border-ink bg-white hover:bg-bubble-soft font-bold cursor-pointer" aria-label={`Quitar color ${color.name || colorIndex + 1}`}>
                    <Trash2 className="w-4 h-4" /> Quitar
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {color.images.map((url, i) => (
                  <div key={url + i} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-ink bg-white">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] font-extrabold bg-lime border border-ink rounded-full px-1.5">Principal</span>}
                    <div className="absolute top-1 right-1 flex gap-1">
                      {i > 0 && (
                        <button type="button" onClick={() => moveImageFirst(color.id, i)} className="w-6 h-6 rounded-full bg-white border border-ink flex items-center justify-center cursor-pointer" aria-label="Usar como foto principal">
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button type="button" onClick={() => updateColor(color.id, { images: color.images.filter((_, j) => j !== i) })} className="w-6 h-6 rounded-full bg-white border border-ink flex items-center justify-center cursor-pointer" aria-label="Quitar foto">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputs.current[color.id]?.click()}
                  disabled={uploadingColor !== null}
                  className="w-24 h-24 rounded-2xl border-2 border-dashed border-ink bg-white flex flex-col items-center justify-center gap-1 text-xs font-bold hover:bg-lime-soft cursor-pointer disabled:cursor-wait"
                >
                  {uploadingColor === color.id ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImagePlus className="w-6 h-6" />}
                  {uploadingColor === color.id ? 'Subiendo...' : 'Subir fotos'}
                </button>
                <input
                  ref={(el) => {
                    fileInputs.current[color.id] = el;
                  }}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  aria-label={`Subir fotos del color ${color.name || colorIndex + 1}`}
                  onChange={(e) => uploadImages(color.id, e.target.files)}
                />
              </div>
              <ImageUrlInput onAdd={(url) => addImageUrl(color.id, url)} />
            </div>
          ))}
        </div>
      </section>

      {/* Sizes and stock */}
      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-extrabold">Tallas e inventario</h3>
          <span className="px-3 py-1 bg-sun border-2 border-ink rounded-full text-sm font-extrabold">{totalUnits} pares en total</span>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-extrabold">Tallas que ofreces (Colombia)</legend>
          <div className="flex flex-wrap gap-2">
            {COL_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`w-12 h-11 rounded-2xl border-2 border-ink font-extrabold cursor-pointer ${draft.sizes.includes(size) ? 'bg-ink text-lime' : 'bg-white text-ink/40'}`}
                aria-pressed={draft.sizes.includes(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-end gap-2">
          <Field label="Poner la misma cantidad en todas">
            <input type="number" min={0} inputMode="numeric" value={fillValue} onChange={(e) => setFillValue(e.target.value)} className={`${inputClass} w-32`} placeholder="Ej. 5" />
          </Field>
          <button type="button" onClick={fillAllStock} className="h-11 px-4 bg-white border-2 border-ink rounded-2xl font-extrabold hover:bg-lime-soft cursor-pointer">
            Aplicar
          </button>
        </div>

        <div className="overflow-x-auto -mx-1 px-1">
          <table className="text-sm border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="text-left px-2 font-extrabold">Color / talla</th>
                {draft.sizes.map((size) => (
                  <th key={size} className="w-16 font-extrabold">{size}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {draft.colors.map((color) => (
                <tr key={color.id}>
                  <th scope="row" className="text-left px-2 font-bold whitespace-nowrap">
                    <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-ink align-middle mr-1.5" style={{ backgroundColor: color.colorHex }} />
                    {color.name || 'Sin nombre'}
                  </th>
                  {draft.sizes.map((size) => {
                    const units = draft.stock[color.id]?.[size] ?? 0;
                    return (
                      <td key={size}>
                        <input
                          type="number"
                          min={0}
                          inputMode="numeric"
                          value={units}
                          onChange={(e) => setUnits(color.id, size, e.target.value)}
                          aria-label={`Unidades de ${color.name || 'color'} talla ${size}`}
                          className={`w-16 px-2 py-2 text-center font-bold border-2 border-ink rounded-xl focus:outline-hidden focus:shadow-pop-sm ${units === 0 ? 'bg-bubble-soft' : 'bg-white'}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Copy */}
      <section className={sectionClass}>
        <h3 className="font-display text-2xl font-extrabold">Textos de la ficha</h3>
        <Field label="Frase destacada" hint="Opcional. Aparece resaltada junto al precio.">
          <input maxLength={240} value={draft.highlight ?? ''} onChange={(e) => set('highlight', e.target.value || undefined)} className={inputClass} />
        </Field>
        <Field label="Descripción">
          <textarea rows={4} maxLength={1500} value={draft.description} onChange={(e) => set('description', e.target.value)} className={inputClass} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Materiales">
            <textarea rows={2} maxLength={400} value={draft.materials ?? ''} onChange={(e) => set('materials', e.target.value || undefined)} className={inputClass} />
          </Field>
          <Field label="Horma / calce">
            <textarea rows={2} maxLength={240} value={draft.fit ?? ''} onChange={(e) => set('fit', e.target.value || undefined)} className={inputClass} placeholder="Ej. Fiel a la talla" />
          </Field>
          <Field label="Cuidados" className="sm:col-span-2">
            <textarea rows={2} maxLength={600} value={draft.care ?? ''} onChange={(e) => set('care', e.target.value || undefined)} className={inputClass} />
          </Field>
        </div>
      </section>

      {errorBox}

      <div className="sticky bottom-24 lg:bottom-4 z-10 flex justify-end gap-3 w-fit ml-auto p-2 bg-cream/95 backdrop-blur-md border-2 border-ink rounded-full shadow-pop">
        <button type="button" onClick={onCancel} className="px-6 py-3 bg-white border-2 border-ink rounded-full font-extrabold cursor-pointer">
          Cancelar
        </button>
        <button type="submit" disabled={saving || uploadingColor !== null} className="px-8 py-3 bg-lime border-2 border-ink rounded-full font-extrabold shadow-pop hover:shadow-pop-lg cursor-pointer disabled:opacity-60 disabled:cursor-wait inline-flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Guardando...' : 'Guardar producto'}
        </button>
      </div>
    </form>
  );
};

const ImageUrlInput: React.FC<{ onAdd: (url: string) => boolean }> = ({ onAdd }) => {
  const [url, setUrl] = useState('');
  return (
    <div className="flex gap-2">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="O pega el enlace de una foto (https://...)"
        aria-label="Enlace de una foto"
        className="flex-1 min-w-0 px-4 py-2 bg-white border-2 border-ink rounded-2xl text-sm focus:outline-hidden"
      />
      <button
        type="button"
        onClick={() => url && onAdd(url) && setUrl('')}
        className="px-4 py-2 bg-white border-2 border-ink rounded-2xl text-sm font-extrabold hover:bg-lime-soft cursor-pointer"
      >
        Agregar
      </button>
    </div>
  );
};
