import { Product, SneakerStyle, StockMatrix } from '../types';

export const BRAND_INFO = {
  name: 'TenisIvan',
  tagline: 'Tenis con actitud para cada paso',
  /** Prices are in Colombian pesos (COP) */
  freeShippingFrom: 250000,
  shippingCost: 15000,
  welcomeCode: 'BIENVENIDA10'
};

export const SNEAKER_STYLES: SneakerStyle[] = [
  { slug: 'running', name: 'Running', tagline: 'Amortiguación para correr la ciudad', color: '#c6f432' },
  { slug: 'urbanos', name: 'Urbanos', tagline: 'Para el día a día con flow', color: '#ff7ab6' },
  { slug: 'basket', name: 'Basket', tagline: 'Caña alta y alma de cancha', color: '#a78bfa' },
  { slug: 'retro', name: 'Retro', tagline: 'Clásicos de los 80 y 90', color: '#ffd23f' },
  { slug: 'skate', name: 'Skate', tagline: 'Suela plana, agarre total', color: '#5cc8ff' }
];

// Colombian sizes (one below the EU scale: COL 39 = EU 40)
export const COL_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];

export const CARD_COLORS = ['#ffd6e7', '#e6fbb0', '#c9ecff', '#e4dcff', '#ffdcc2', '#fff1b8'];

const img = (id: string, w = 1000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const LIFESTYLE_SHOTS = [
  img('1491553895911-0055eca6402d'),
  img('1552346154-21d32810aba3'),
  img('1514989940723-e8b51635b782'),
  img('1512374382149-233c42b6a83b')
];

const DEFAULT_CARE =
  'Limpia la parte superior con un paño húmedo y jabón neutro. Lava cordones y plantilla a mano por separado y deja secar a la sombra, nunca en secadora.';

type SampleInput = Omit<Product, 'sizes' | 'stock' | 'published' | 'care'> & {
  stockPlan: { soldOut?: string[]; lowStock?: string[] };
  lifestyleIndex: number;
};

/** Example data so the store has something to show before real products are loaded */
const sample = ({ stockPlan, lifestyleIndex, ...p }: SampleInput): Product => {
  const stock: StockMatrix = {};
  p.colors.forEach((color, i) => {
    stock[color.id] = Object.fromEntries(
      COL_SIZES.map((size) => [
        size,
        stockPlan.soldOut?.includes(size) ? 0 : stockPlan.lowStock?.includes(size) ? 2 : i === 0 ? 8 : 4
      ])
    );
  });
  const [first, ...rest] = p.colors;
  return {
    ...p,
    colors: [{ ...first, images: [...first.images, LIFESTYLE_SHOTS[lifestyleIndex % LIFESTYLE_SHOTS.length]] }, ...rest],
    sizes: COL_SIZES,
    stock,
    care: DEFAULT_CARE,
    published: true
  };
};

export const SAMPLE_PRODUCTS: Product[] = [
  sample({
    id: 'flux-runner',
    title: 'Flux Runner',
    subtitle: 'Malla ultraligera y espuma reactiva para correr sin pensar',
    category: 'running',
    targetGender: 'Unisex',
    price: 479900,
    originalPrice: 559900,
    featured: true,
    badge: 'Top ventas',
    cardColor: '#ffd6e7',
    colors: [
      { id: 'fire', name: 'Rojo Fuego', colorHex: '#e5383b', images: [img('1542291026-7eec264c27ff')] },
      { id: 'cloud', name: 'Blanco Nube', colorHex: '#f4f4f0', images: [img('1600269452121-4f2416e55c28')] }
    ],
    stockPlan: { soldOut: ['44'], lowStock: ['37', '42'] },
    highlight: 'Ligeras como una pluma y con rebote en cada zancada: tus 5K de la mañana nunca se sintieron tan fáciles.',
    description: 'Diseñamos las Flux Runner para quienes corren antes del trabajo y siguen caminando todo el día. La mediasuela de espuma reactiva devuelve energía en cada paso y la malla transpirable mantiene el pie fresco incluso en verano.',
    materials: 'Parte superior de malla técnica reciclada, mediasuela de espuma EVA reactiva y suela de caucho.',
    fit: 'Horma regular. Si estás entre dos tallas, elige la mayor.',
    lifestyleIndex: 0
  }),
  sample({
    id: 'volt-pace',
    title: 'Volt Pace',
    subtitle: 'Tenis de running con placa flexible para ganar ritmo',
    category: 'running',
    targetGender: 'Mujer',
    price: 399900,
    badge: 'Nuevo',
    cardColor: '#e6fbb0',
    colors: [
      { id: 'multi', name: 'Multicolor Pop', colorHex: '#7c3aed', images: [img('1608231387042-66d1773070a5')] },
      { id: 'blue', name: 'Azul Eléctrico', colorHex: '#2563eb', images: [img('1551107696-a4b0c5a0d9a2')] }
    ],
    stockPlan: { soldOut: ['43', '44'], lowStock: ['35'] },
    highlight: 'Una placa flexible en la mediasuela que te empuja hacia delante: más ritmo con el mismo esfuerzo.',
    description: 'Las Volt Pace nacieron para quienes quieren bajar su marca personal sin renunciar a la comodidad. Su horma está pensada para pies estrechos y el talón acolchado evita rozaduras desde el primer día.',
    materials: 'Malla tejida, placa de nylon flexible y suela de caucho de alta abrasión.',
    fit: 'Horma femenina, algo estrecha. Fiel a la talla.',
    lifestyleIndex: 1
  }),
  sample({
    id: 'aero-run',
    title: 'Aero Run',
    subtitle: 'Running de diario con amortiguación extra en el talón',
    category: 'running',
    targetGender: 'Hombre',
    price: 439900,
    cardColor: '#c9ecff',
    colors: [
      { id: 'grey', name: 'Gris Asfalto', colorHex: '#8d99ae', images: [img('1460353581641-37baddab0fa2')] },
      { id: 'black', name: 'Negro Total', colorHex: '#1f1f1f', images: [img('1543508282-6319a3e2621f')] }
    ],
    stockPlan: { soldOut: ['35', '36'], lowStock: ['43'] },
    highlight: 'Kilómetros y kilómetros sin dolor de rodillas: el talón extra acolchado absorbe cada impacto.',
    description: 'Las Aero Run son el tenis que no te falla: cómodas desde el primer día, resistentes al desgaste y con un diseño limpio que también funciona fuera del entrenamiento.',
    materials: 'Malla de doble capa, espuma de doble densidad y suela de caucho carbono.',
    fit: 'Horma amplia. Fiel a la talla.',
    lifestyleIndex: 2
  }),
  sample({
    id: 'hoop-high-85',
    title: "Hoop High '85",
    subtitle: 'Bota de basket de caña alta en piel con colores clásicos',
    category: 'basket',
    targetGender: 'Unisex',
    price: 599900,
    badge: 'Edición limitada',
    cardColor: '#e4dcff',
    colors: [
      { id: 'chicago', name: 'Rojo & Negro', colorHex: '#c1121f', images: [img('1595341888016-a392ef81b7de')] },
      { id: 'royal', name: 'Azul Royal', colorHex: '#1d4ed8', images: [img('1607522370275-f14206abe5d3')] }
    ],
    stockPlan: { soldOut: ['35', '44'], lowStock: ['39', '40', '41'] },
    highlight: 'El clásico de cancha que nunca pasa de moda, ahora en edición limitada.',
    description: "Inspiradas en las botas de basket de mediados de los 80, las Hoop High '85 combinan piel de calidad, caña alta acolchada y una suela con pivote que funciona igual de bien en la cancha que en la calle.",
    materials: 'Piel con acabado liso, forro textil y suela de caucho con círculo de pivote.',
    fit: 'Fiel a la talla. Los primeros días la piel se adapta a tu pie.',
    lifestyleIndex: 3
  }),
  sample({
    id: 'fly-court-mid',
    title: 'Fly Court Mid',
    subtitle: 'Caña media para jugar y para lucir',
    category: 'basket',
    targetGender: 'Hombre',
    price: 539900,
    originalPrice: 639900,
    cardColor: '#ffdcc2',
    colors: [
      { id: 'orange', name: 'Naranja Volcán', colorHex: '#f97316', images: [img('1539185441755-769473a23570')] },
      { id: 'white', name: 'Blanco Hueso', colorHex: '#f5f0e6', images: [img('1600185365483-26d7a4cc7519')] }
    ],
    stockPlan: { soldOut: ['35', '36', '37'] },
    highlight: 'Amortiguación de cancha con un diseño que roba miradas.',
    description: 'Las Fly Court Mid toman lo mejor del basket moderno, como la cámara de aire en el talón y la caña media acolchada, y lo llevan a un tenis que puedes usar todo el día.',
    materials: 'Sintético reforzado, malla en lengüeta y suela de caucho en espiga.',
    fit: 'Fiel a la talla.',
    lifestyleIndex: 0
  }),
  sample({
    id: 'retro-court-88',
    title: "Retro Court '88",
    subtitle: 'Tenis bajo de piel con alma vintage',
    category: 'retro',
    targetGender: 'Unisex',
    price: 359900,
    originalPrice: 439900,
    badge: 'Favorito',
    cardColor: '#fff1b8',
    colors: [
      { id: 'white-green', name: 'Blanco & Verde', colorHex: '#f1f1eb', images: [img('1595950653106-6c9ebd614d3a')] },
      { id: 'white-navy', name: 'Blanco & Marino', colorHex: '#1b2a4a', images: [img('1560769629-975ec94e6a86')] },
      { id: 'all-white', name: 'Blanco Total', colorHex: '#f8f8f6', images: [img('1549298916-b41d501d3772')] }
    ],
    stockPlan: { soldOut: [], lowStock: ['36', '42'] },
    highlight: 'El tenis blanco que combina con absolutamente todo.',
    description: "Inspirados en las canchas de los 80, los Retro Court '88 tienen la estética vintage que te gusta y la comodidad que esperas hoy: plantilla de memory foam y forro transpirable. Sin periodo de adaptación.",
    materials: 'Piel con detalles en ante y suela de caucho vulcanizado.',
    fit: 'Fiel a la talla.',
    lifestyleIndex: 1
  }),
  sample({
    id: 'clean-court',
    title: 'Clean Court',
    subtitle: 'Minimalistas, blancos y con plataforma ligera',
    category: 'urbanos',
    targetGender: 'Mujer',
    price: 319900,
    cardColor: '#ffd6e7',
    colors: [
      { id: 'white', name: 'Blanco Puro', colorHex: '#ffffff', images: [img('1600185365926-3a2ce3cdb9eb')] },
      { id: 'cream', name: 'Crema', colorHex: '#f3e9d2', images: [img('1597045566677-8cf032ed6634')] }
    ],
    stockPlan: { soldOut: ['43', '44'], lowStock: ['38'] },
    highlight: 'Tu par blanco de confianza, con 3 cm extra de altura sin perder comodidad.',
    description: 'Las Clean Court tienen líneas limpias, una plataforma ligera y una plantilla acolchada. Son el básico que levanta cualquier outfit.',
    materials: 'Piel sintética de alta calidad y suela de goma con plataforma.',
    fit: 'Fiel a la talla.',
    lifestyleIndex: 2
  }),
  sample({
    id: 'cloud-step',
    title: 'Cloud Step',
    subtitle: 'Urbanos con suela chunky y bloques de color',
    category: 'urbanos',
    targetGender: 'Unisex',
    price: 379900,
    badge: 'Nuevo',
    cardColor: '#e6fbb0',
    colors: [
      { id: 'pop', name: 'Bloques Pop', colorHex: '#22c55e', images: [img('1606107557195-0e29a4b5b4aa')] },
      { id: 'grey', name: 'Gris Perla', colorHex: '#d4d4d8', images: [img('1584735175315-9d5df23860e6')] }
    ],
    stockPlan: { soldOut: ['35'], lowStock: ['41'] },
    highlight: 'Suela chunky, colores que se notan y la sensación de caminar sobre nubes.',
    description: 'Las Cloud Step mezclan la estética chunky de los 2000 con una espuma ultraligera. Pisan fuerte, pesan poco y combinan con tu lado más atrevido.',
    materials: 'Combinación de malla y gamuza sintética, suela de EVA chunky.',
    fit: 'Fiel a la talla.',
    lifestyleIndex: 3
  }),
  sample({
    id: 'kickflip-low',
    title: 'Kickflip Low',
    subtitle: 'Skate clásico de lona y gamuza con suela waffle',
    category: 'skate',
    targetGender: 'Unisex',
    price: 279900,
    cardColor: '#c9ecff',
    colors: [
      { id: 'black', name: 'Negro & Blanco', colorHex: '#111111', images: [img('1525966222134-fcfa99b8ae77')] }
    ],
    stockPlan: { soldOut: [], lowStock: ['40'] },
    highlight: 'Agarre total sobre la tabla y estilo que aguanta cualquier caída.',
    description: 'Los Kickflip Low son el skate de siempre: lona resistente, gamuza en las zonas de roce y suela waffle vulcanizada que se pega a la lija.',
    materials: 'Lona y gamuza, suela de caucho vulcanizado tipo waffle.',
    fit: 'Fiel a la talla.',
    lifestyleIndex: 0
  }),
  sample({
    id: 'blaze-trail',
    title: 'Blaze Trail',
    subtitle: 'Urbanos de inspiración outdoor con suela de tacos',
    category: 'urbanos',
    targetGender: 'Hombre',
    price: 499900,
    cardColor: '#ffdcc2',
    colors: [
      { id: 'sand', name: 'Arena', colorHex: '#d6b88d', images: [img('1515955656352-a1fa3ffcd111')] },
      { id: 'black', name: 'Negro Carbón', colorHex: '#262626', images: [img('1587563871167-1ee9c731aefb')] }
    ],
    stockPlan: { soldOut: ['35', '36'], lowStock: ['44'] },
    highlight: 'De la ciudad al cerro sin cambiarte de tenis.',
    description: 'Las Blaze Trail tienen suela de tacos con buen agarre, refuerzos en la puntera y un estilo gorpcore que funciona igual en la oficina que en una caminata.',
    materials: 'Malla resistente al agua, refuerzos de TPU y suela de caucho con tacos.',
    fit: 'Horma amplia. Fiel a la talla.',
    lifestyleIndex: 1
  })
];
