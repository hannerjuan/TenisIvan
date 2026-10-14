import { DepartmentInfo, GarmentType, Product, StockMatrix } from '../types';

export const BRAND_INFO = {
  name: 'TenisIvan',
  tagline: 'Ropa y tenis para toda la familia',
  /** Prices are in Colombian pesos (COP) */
  freeShippingFrom: 250000,
  shippingCost: 15000,
  welcomeCode: 'BIENVENIDA10',
  /** Orders are closed over WhatsApp: country code + number, digits only */
  whatsappNumber: '573228251892'
};

export const DEPARTMENTS: DepartmentInfo[] = [
  { slug: 'hombre', name: 'Hombre', tagline: 'Ropa y tenis para él', color: '#5cc8ff' },
  { slug: 'mujer', name: 'Mujer', tagline: 'Ropa y tenis para ella', color: '#ff7ab6' },
  { slug: 'nino', name: 'Niño', tagline: 'Para los más pequeños de la casa', color: '#c6f432' }
];

/** Garment types (subcategories); each one decides which sizes a product can have */
export const GARMENT_TYPES: GarmentType[] = [
  { slug: 'tenis', name: 'Tenis', sizeChart: 'calzado' },
  { slug: 'camisetas', name: 'Camisetas', sizeChart: 'superior' },
  { slug: 'buzos', name: 'Buzos y chaquetas', sizeChart: 'superior' },
  { slug: 'jeans', name: 'Jeans', sizeChart: 'inferior' },
  { slug: 'pantalones', name: 'Pantalones', sizeChart: 'inferior' },
  { slug: 'shorts', name: 'Shorts', sizeChart: 'inferior' },
  { slug: 'accesorios', name: 'Accesorios', sizeChart: 'unica' }
];

// Colombian shoe sizes (one below the EU scale: COL 39 = EU 40)
export const COL_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];
const KIDS_SHOE_SIZES = ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34'];
const LETTER_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const KIDS_CLOTHING_SIZES = ['2', '4', '6', '8', '10', '12', '14', '16'];
const MEN_WAIST_SIZES = ['28', '30', '32', '34', '36', '38', '40'];
const WOMEN_PANTS_SIZES = ['4', '6', '8', '10', '12', '14', '16'];

/** Sizes a product can be offered in, in display order */
export const sizesFor = (department: string, garment: string): string[] => {
  const chart = GARMENT_TYPES.find((g) => g.slug === garment)?.sizeChart;
  const kids = department === 'nino';
  if (chart === 'calzado') return kids ? KIDS_SHOE_SIZES : COL_SIZES;
  if (chart === 'superior') return kids ? KIDS_CLOTHING_SIZES : LETTER_SIZES;
  if (chart === 'inferior') return kids ? KIDS_CLOTHING_SIZES : department === 'mujer' ? WOMEN_PANTS_SIZES : MEN_WAIST_SIZES;
  return ['Única'];
};

const img = (id: string, w = 1000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const LIFESTYLE_SHOTS = [
  img('1491553895911-0055eca6402d'),
  img('1552346154-21d32810aba3'),
  img('1514989940723-e8b51635b782'),
  img('1512374382149-233c42b6a83b')
];

type SampleInput = Omit<Product, 'sizes' | 'stock' | 'published'> & {
  stockPlan: { soldOut?: string[]; lowStock?: string[] };
  lifestyleIndex: number;
};

/** Example data so the store has something to show before real products are loaded */
const sample = ({ stockPlan, lifestyleIndex, ...p }: SampleInput): Product => {
  const sizes = sizesFor(p.department, p.garment);
  const stock: StockMatrix = {};
  p.colors.forEach((color, i) => {
    stock[color.id] = Object.fromEntries(
      sizes.map((size) => [
        size,
        stockPlan.soldOut?.includes(size) ? 0 : stockPlan.lowStock?.includes(size) ? 2 : i === 0 ? 8 : 4
      ])
    );
  });
  const [first, ...rest] = p.colors;
  return {
    ...p,
    colors: [{ ...first, images: [...first.images, LIFESTYLE_SHOTS[lifestyleIndex % LIFESTYLE_SHOTS.length]] }, ...rest],
    sizes,
    stock,
    published: true
  };
};

export const SAMPLE_PRODUCTS: Product[] = [
  sample({
    id: 'flux-runner',
    title: 'Flux Runner',
    subtitle: 'Malla ultraligera y espuma reactiva para correr sin pensar',
    garment: 'tenis',
    department: 'mujer',
    price: 479900,
    originalPrice: 559900,
    featured: true,
    colors: [
      { id: 'fire', name: 'Rojo Fuego', colorHex: '#e5383b', images: [img('1542291026-7eec264c27ff')] },
      { id: 'cloud', name: 'Blanco Nube', colorHex: '#f4f4f0', images: [img('1600269452121-4f2416e55c28')] }
    ],
    stockPlan: { soldOut: ['44'], lowStock: ['37', '42'] },
    lifestyleIndex: 0
  }),
  sample({
    id: 'volt-pace',
    title: 'Volt Pace',
    subtitle: 'Tenis de running con placa flexible para ganar ritmo',
    garment: 'tenis',
    department: 'mujer',
    price: 399900,
    colors: [
      { id: 'multi', name: 'Multicolor Pop', colorHex: '#7c3aed', images: [img('1608231387042-66d1773070a5')] },
      { id: 'blue', name: 'Azul Eléctrico', colorHex: '#2563eb', images: [img('1551107696-a4b0c5a0d9a2')] }
    ],
    stockPlan: { soldOut: ['43', '44'], lowStock: ['35'] },
    lifestyleIndex: 1
  }),
  sample({
    id: 'aero-run',
    title: 'Aero Run',
    subtitle: 'Running de diario con amortiguación extra en el talón',
    garment: 'tenis',
    department: 'hombre',
    price: 439900,
    colors: [
      { id: 'grey', name: 'Gris Asfalto', colorHex: '#8d99ae', images: [img('1460353581641-37baddab0fa2')] },
      { id: 'black', name: 'Negro Total', colorHex: '#1f1f1f', images: [img('1543508282-6319a3e2621f')] }
    ],
    stockPlan: { soldOut: ['35', '36'], lowStock: ['43'] },
    lifestyleIndex: 2
  }),
  sample({
    id: 'hoop-high-85',
    title: "Hoop High '85",
    subtitle: 'Bota de basket de caña alta en piel con colores clásicos',
    garment: 'tenis',
    department: 'hombre',
    price: 599900,
    colors: [
      { id: 'chicago', name: 'Rojo & Negro', colorHex: '#c1121f', images: [img('1595341888016-a392ef81b7de')] },
      { id: 'royal', name: 'Azul Royal', colorHex: '#1d4ed8', images: [img('1607522370275-f14206abe5d3')] }
    ],
    stockPlan: { soldOut: ['35', '44'], lowStock: ['39', '40', '41'] },
    lifestyleIndex: 3
  }),
  sample({
    id: 'fly-court-mid',
    title: 'Fly Court Mid',
    subtitle: 'Caña media para jugar y para lucir',
    garment: 'tenis',
    department: 'hombre',
    price: 539900,
    originalPrice: 639900,
    colors: [
      { id: 'orange', name: 'Naranja Volcán', colorHex: '#f97316', images: [img('1539185441755-769473a23570')] },
      { id: 'white', name: 'Blanco Hueso', colorHex: '#f5f0e6', images: [img('1600185365483-26d7a4cc7519')] }
    ],
    stockPlan: { soldOut: ['35', '36', '37'] },
    lifestyleIndex: 0
  }),
  sample({
    id: 'retro-court-88',
    title: "Retro Court '88",
    subtitle: 'Tenis bajo de piel con alma vintage',
    garment: 'tenis',
    department: 'mujer',
    price: 359900,
    originalPrice: 439900,
    colors: [
      { id: 'white-green', name: 'Blanco & Verde', colorHex: '#f1f1eb', images: [img('1595950653106-6c9ebd614d3a')] },
      { id: 'white-navy', name: 'Blanco & Marino', colorHex: '#1b2a4a', images: [img('1560769629-975ec94e6a86')] },
      { id: 'all-white', name: 'Blanco Total', colorHex: '#f8f8f6', images: [img('1549298916-b41d501d3772')] }
    ],
    stockPlan: { soldOut: [], lowStock: ['36', '42'] },
    lifestyleIndex: 1
  }),
  sample({
    id: 'clean-court',
    title: 'Clean Court',
    subtitle: 'Minimalistas, blancos y con plataforma ligera',
    garment: 'tenis',
    department: 'mujer',
    price: 319900,
    colors: [
      { id: 'white', name: 'Blanco Puro', colorHex: '#ffffff', images: [img('1600185365926-3a2ce3cdb9eb')] },
      { id: 'cream', name: 'Crema', colorHex: '#f3e9d2', images: [img('1597045566677-8cf032ed6634')] }
    ],
    stockPlan: { soldOut: ['43', '44'], lowStock: ['38'] },
    lifestyleIndex: 2
  }),
  sample({
    id: 'cloud-step',
    title: 'Cloud Step',
    subtitle: 'Urbanos con suela chunky y bloques de color',
    garment: 'tenis',
    department: 'hombre',
    price: 379900,
    colors: [
      { id: 'pop', name: 'Bloques Pop', colorHex: '#22c55e', images: [img('1606107557195-0e29a4b5b4aa')] },
      { id: 'grey', name: 'Gris Perla', colorHex: '#d4d4d8', images: [img('1584735175315-9d5df23860e6')] }
    ],
    stockPlan: { soldOut: ['35'], lowStock: ['41'] },
    lifestyleIndex: 3
  }),
  sample({
    id: 'kickflip-low',
    title: 'Kickflip Low',
    subtitle: 'Skate clásico de lona y gamuza con suela waffle',
    garment: 'tenis',
    department: 'mujer',
    price: 279900,
    colors: [
      { id: 'black', name: 'Negro & Blanco', colorHex: '#111111', images: [img('1525966222134-fcfa99b8ae77')] }
    ],
    stockPlan: { soldOut: [], lowStock: ['40'] },
    lifestyleIndex: 0
  }),
  sample({
    id: 'blaze-trail',
    title: 'Blaze Trail',
    subtitle: 'Urbanos de inspiración outdoor con suela de tacos',
    garment: 'tenis',
    department: 'hombre',
    price: 499900,
    colors: [
      { id: 'sand', name: 'Arena', colorHex: '#d6b88d', images: [img('1515955656352-a1fa3ffcd111')] },
      { id: 'black', name: 'Negro Carbón', colorHex: '#262626', images: [img('1587563871167-1ee9c731aefb')] }
    ],
    stockPlan: { soldOut: ['35', '36'], lowStock: ['44'] },
    lifestyleIndex: 1
  })
];
