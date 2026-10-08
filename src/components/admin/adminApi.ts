import type { Product } from '../../types';

const request = async <T,>(token: string, path: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetch(path, {
    ...init,
    headers: { Authorization: `Bearer ${encodeURIComponent(token)}`, ...(init.headers ?? {}) }
  });
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json() : {};
  if (!response.ok) {
    throw new Error(body.error ?? (isJson ? 'Algo salió mal.' : 'El panel solo funciona con la tienda publicada en Netlify.'));
  }
  return body as T;
};

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

export const adminApi = {
  listProducts: (token: string) => request<{ products: Product[] }>(token, '/api/admin/products'),
  saveProduct: (token: string, product: Product) =>
    request<{ product: Product; products: Product[] }>(token, '/api/admin/products', jsonInit('PUT', { product })),
  deleteProduct: (token: string, id: string) =>
    request<{ products: Product[] }>(token, `/api/admin/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  importSample: (token: string) =>
    request<{ products: Product[] }>(token, '/api/admin/products', jsonInit('POST', { action: 'import-sample' })),
  listOrders: <T,>(token: string) => request<{ orders: T[] }>(token, '/api/orders'),
  uploadImage: (token: string, file: Blob) =>
    request<{ url: string }>(token, '/api/admin/images', { method: 'POST', headers: { 'Content-Type': file.type }, body: file })
};

const MAX_SIDE = 1600;

/** Shrinks a photo in the browser (max 1600px, JPEG) so uploads stay small and fast */
export const resizeImage = (file: File): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('No se pudo procesar la foto.'));
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('No se pudo procesar la foto.'))), 'image/jpeg', 0.85);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Ese archivo no parece una foto.'));
    };
    image.src = url;
  });
