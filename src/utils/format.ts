const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

/** Formats a price in Colombian pesos, e.g. 479900 -> "$ 479.900" */
export const formatPrice = (value: number) => copFormatter.format(Math.round(value));
