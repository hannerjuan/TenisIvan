export type Department = 'hombre' | 'mujer' | 'nino';

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
  /** Main category, see DEPARTMENTS */
  department: Department;
  /** Garment type (subcategory) slug, see GARMENT_TYPES */
  garment: string;
  /** Prices in Colombian pesos */
  price: number;
  originalPrice?: number;
  /** Shown first on the home page */
  featured?: boolean;
  colors: ProductColor[];
  /** Sizes offered for this product, taken from its garment type's size chart */
  sizes: string[];
  stock: StockMatrix;
  /** Hidden from the store while false */
  published: boolean;
  updatedAt?: string;
}

export interface DepartmentInfo {
  slug: Department;
  name: string;
  tagline: string;
  color: string;
}

export type SizeChart = 'calzado' | 'superior' | 'inferior' | 'unica';

export interface GarmentType {
  slug: string;
  name: string;
  sizeChart: SizeChart;
}

export type ActiveTab = 'home' | 'catalog' | 'pdp';
