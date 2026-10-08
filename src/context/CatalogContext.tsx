import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Product } from '../types';
import { SAMPLE_PRODUCTS } from '../data/catalog';
import { isLivePayments } from '../utils/payments';

type CatalogStatus = 'loading' | 'ready' | 'sample' | 'error';

interface CatalogValue {
  products: Product[];
  status: CatalogStatus;
}

const CatalogContext = createContext<CatalogValue>({ products: [], status: 'loading' });

/**
 * Loads the published catalog from the server. Without a server (local development or the
 * demo), the example catalog is shown instead; a live store never falls back to it, so
 * example products can't be sold by accident.
 */
export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [value, setValue] = useState<CatalogValue>({ products: [], status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/products')
      .then(async (response) => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        if (!response.ok || !isJson) throw new Error('Catalog unavailable');
        const { products } = (await response.json()) as { products: Product[] };
        if (!cancelled) setValue({ products, status: 'ready' });
      })
      .catch(() => {
        if (cancelled) return;
        setValue(isLivePayments ? { products: [], status: 'error' } : { products: SAMPLE_PRODUCTS, status: 'sample' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => useContext(CatalogContext);
