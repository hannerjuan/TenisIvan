export interface ProductVariant {
  id: string;
  name: string;
  colorHex: string;
  inStock: boolean;
  image: string;
}

export interface ProductSize {
  size: string;
  available: boolean;
  stockCount?: number;
}

export interface ProductReview {
  id: string;
  author: string;
  age: number;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  fitFeedback: 'Fiel a la talla' | 'Un poco grande' | 'Un poco ajustado';
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  subcategory: string;
  targetGender: 'Unisex' | 'Mujer' | 'Hombre';
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  badge?: string;
  rating: number;
  reviewCount: number;
  colors: ProductVariant[];
  sizes: ProductSize[];
  heroImage: string;
  galleryImages: {
    type: 'studio' | 'lifestyle' | 'texture' | 'lookbook';
    label: string;
    url: string;
    description: string;
  }[];
  // Copywriting fields
  hook: string;
  storytelling: string;
  styleBenefits: {
    whenToWear: string;
    howToStyle: string;
    comfortVibe: string;
  };
  technicalSpecs: {
    materials: string;
    fitType: string;
    origin: string;
    ecoDetails?: string;
  };
  careInstructions: string[];
  microcopyUrgency: string;
  pairingSuggestions: {
    productId: string;
    title: string;
    price: number;
    image: string;
  }[];
}

export interface CategoryTreeItem {
  id: string;
  name: string;
  iconName: string;
  slug: string;
  description: string;
  badge?: string;
  subcategories: {
    name: string;
    slug: string;
    description: string;
    popular?: boolean;
  }[];
}

export interface VisualGuideShot {
  id: string;
  title: string;
  purpose: string;
  exampleImage: string;
  specs: {
    angle: string;
    lighting: string;
    background: string;
    modelDirection: string;
  };
  dos: string[];
  donts: string[];
}

export type ActiveTab = 'home' | 'catalog' | 'pdp';
