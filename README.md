# TenisIvan 👟

Tienda online de tenis: **Running, Urbanos, Basket, Retro y Skate**.
Precios en pesos colombianos (COP) y tallas colombianas.

## Funcionalidades

- Catálogo con filtros por estilo, género y talla, búsqueda y orden por precio o valoración.
- Ficha de producto con galería por color, selector de talla, guía de tallas (largo del pie → talla COL) y opiniones.
- Favoritos, bolsa de compra con cupón (`BIENVENIDA10`) y envío gratis desde $ 250.000.
- Checkout en dos pasos (envío y pago) con **PSE, Nequi y tarjeta** a través de Wompi.
- Página privada de pedidos en `/#pedidos`.

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
| `npm test` | Pruebas de precios, firmas de Wompi, webhook y pedidos |

## Dónde cambiar cosas

- Productos, precios y tallas: `src/data/catalog.ts`
- Colores y tipografías de la marca: `src/index.css`
- Formato de moneda: `src/utils/format.ts`

## Pagos reales con Wompi (PSE, Nequi y tarjeta)

Sin configuración, el checkout funciona en **modo demostración**: avisa que no se cobra nada.
Para cobrar de verdad:

1. **Crea tu cuenta de comercio en Wompi** (https://comercios.wompi.co). En *Desarrolladores* encontrarás,
   para pruebas (sandbox) y para producción:
   - Llave pública (`pub_test_...` / `pub_prod_...`)
   - Secreto de integridad
   - Secreto de eventos
2. **Publica la tienda en Netlify**: *Add new site → Import from GitHub* y elige este repositorio.
   `netlify.toml` ya trae la configuración de build y de funciones.
3. En Netlify, *Site configuration → Environment variables*, crea:

   | Variable | Valor |
   | --- | --- |
   | `VITE_PAYMENTS_MODE` | `wompi` |
   | `WOMPI_PUBLIC_KEY` | tu llave pública |
   | `WOMPI_INTEGRITY_SECRET` | tu secreto de integridad |
   | `WOMPI_EVENTS_SECRET` | tu secreto de eventos |
   | `ADMIN_TOKEN` | una contraseña larga (12+ caracteres) para ver los pedidos |

   Después vuelve a desplegar (*Deploys → Trigger deploy*): `VITE_PAYMENTS_MODE` se aplica al construir.
4. En Wompi, configura la **URL de eventos**: `https://<tu-sitio>.netlify.app/api/wompi-events`.
5. Prueba primero con las llaves **sandbox** (`pub_test_...`): Wompi tiene datos de prueba para aprobar o
   rechazar pagos con PSE, Nequi y tarjeta sin mover dinero. Cuando todo funcione, cambia a las llaves de producción.

### Cómo funciona

1. El cliente llena sus datos y pulsa *Pagar*.
2. `/api/checkout` recalcula el total con el catálogo (no confía en el precio del navegador), guarda el pedido
   como *Pendiente* y devuelve el enlace firmado al checkout de Wompi.
3. El cliente paga en Wompi con PSE, Nequi o tarjeta y vuelve a la tienda, que muestra el resultado.
4. Wompi avisa a `/api/wompi-events` (firma verificada) y el pedido pasa a *Pagado* o *Rechazado*.
   Un pago por un monto distinto al del pedido nunca se marca como pagado.
5. Revisa los pedidos (productos, tallas, dirección y estado) en `https://<tu-sitio>/#pedidos` con tu `ADMIN_TOKEN`.

Las llaves secretas viven solo en las variables de entorno de Netlify: nunca las pongas en el código.
