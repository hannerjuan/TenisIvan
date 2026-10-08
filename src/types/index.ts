export type Gender = 'Unisex' | 'Mujer' | 'Hombre';

export interface ProductColor {
  id: string;
  name: string;
  colorHex: string;
  /** Photo URLs for this colourway, first one is the main photo */
  images: string[];
}

/** Units in stock per colour and size: stock[colorId][size] */
export type StockMatrix = Record<string, Record<string, number>>;

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  /** Style slug, see SNEAKER_STYLES */
  category: string;
  targetGender: Gender;
  /** Prices in Colombian pesos */
  price: number;
  originalPrice?: number;
  badge?: string;
  /** Shown first on the home page */
  featured?: boolean;
  /** Background colour of the product card */
  cardColor: string;
  highlight?: string;
  description: string;
  materials?: string;
  fit?: string;
  care?: string;
  colors: ProductColor[];
  /** Colombian sizes offered for this model */
  sizes: string[];
  stock: StockMatrix;
  /** Hidden from the store while false */
  published: boolean;
  updatedAt?: string;
}

export interface SneakerStyle {
  slug: string;
  name: string;
  tagline: string;
  color: string;
}

export type ActiveTab = 'home' | 'catalog' | 'pdp';
