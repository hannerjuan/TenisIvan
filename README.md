# TenisIvan 👟

Tienda online de tenis: **Running, Urbanos, Basket, Retro y Skate**.
Precios en pesos colombianos (COP) y tallas colombianas.

## Funcionalidades

- Catálogo con filtros por estilo, género y talla, búsqueda y orden por precio o valoración.
- Ficha de producto con galería por color, selector de talla, guía de tallas (largo del pie → talla COL) y opiniones.
- Favoritos, bolsa de compra con cupón (`BIENVENIDA10`) y envío gratis desde $ 250.000.
- Checkout en dos pasos (envío y pago).

## Ejecutar en local

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en el puerto 3000 |
| `npm run build` | Build de producción en `dist/` |
| `npm run lint` | Chequeo de tipos con TypeScript |

## Dónde cambiar cosas

- Productos, precios y tallas: `src/data/catalog.ts`
- Colores y tipografías de la marca: `src/index.css`
- Formato de moneda: `src/utils/format.ts`
