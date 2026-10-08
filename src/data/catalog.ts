import { Product, ProductSize, SneakerStyle } from '../types';

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

const img = (id: string, w = 1000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Colombian sizes (one below the EU scale: COL 39 = EU 40)
export const COL_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];

const buildSizes = (soldOut: string[] = [], lowStock: string[] = []): ProductSize[] =>
  COL_SIZES.map((n) => ({
    size: n,
    available: !soldOut.includes(n),
    stockCount: lowStock.includes(n) ? 2 : 10
  }));

const LIFESTYLE_SHOTS = [
  img('1491553895911-0055eca6402d'),
  img('1552346154-21d32810aba3'),
  img('1514989940723-e8b51635b782'),
  img('1512374382149-233c42b6a83b')
];

const DEFAULT_CARE = [
  'Limpia la parte superior con un paño húmedo y jabón neutro.',
  'Retira los cordones y la plantilla para lavarlos a mano por separado.',
  'Deja secar a la sombra, nunca en secadora ni al sol directo.',
  'Rellénalos con papel mientras se secan para que mantengan la forma.'
];

type SneakerInput = Omit<
  Product,
  'slug' | 'heroImage' | 'galleryImages' | 'careInstructions' | 'pairingSuggestions'
> & { lifestyleIndex: number };

const sneaker = ({ lifestyleIndex, ...p }: SneakerInput): Product => ({
  ...p,
  slug: p.id,
  heroImage: p.colors[0].image,
  galleryImages: [
    ...p.colors.map((c, i) => ({
      type: 'studio' as const,
      label: i === 0 ? 'Vista principal' : c.name,
      url: c.image,
      description: `${p.title} en color ${c.name}.`
    })),
    {
      type: 'lifestyle' as const,
      label: 'En la calle',
      url: LIFESTYLE_SHOTS[lifestyleIndex % LIFESTYLE_SHOTS.length],
      description: 'Así se ven puestos en el día a día.'
    }
  ],
  careInstructions: DEFAULT_CARE,
  pairingSuggestions: []
});

const products: Product[] = [
  sneaker({
    id: 'flux-runner',
    title: 'Flux Runner',
    subtitle: 'Malla ultraligera y espuma reactiva para correr sin pensar',
    category: 'running',
    subcategory: 'Running',
    targetGender: 'Unisex',
    price: 479900,
    originalPrice: 559900,
    isBestSeller: true,
    badge: 'Top ventas',
    cardColor: '#ffd6e7',
    rating: 4.9,
    reviewCount: 412,
    colors: [
      { id: 'fire', name: 'Rojo Fuego', colorHex: '#e5383b', inStock: true, image: img('1542291026-7eec264c27ff') },
      { id: 'cloud', name: 'Blanco Nube', colorHex: '#f4f4f0', inStock: true, image: img('1600269452121-4f2416e55c28') }
    ],
    sizes: buildSizes(['44'], ['37', '42']),
    hook: 'Ligeras como una pluma y con rebote en cada zancada: tus 5K de la mañana nunca se sintieron tan fáciles.',
    storytelling: 'Diseñamos las Flux Runner para quienes corren antes del trabajo y siguen caminando todo el día. La mediasuela de espuma reactiva devuelve energía en cada paso y la malla transpirable mantiene el pie fresco incluso en verano.',
    styleBenefits: {
      whenToWear: 'Entrenamientos de 5 a 15 km, gimnasio y días largos de pie.',
      howToStyle: 'Con joggers, shorts deportivos o un jean ajustado para un look athleisure.',
      comfortVibe: 'Pisada suave y estable, con buen agarre en asfalto mojado.'
    },
    technicalSpecs: {
      materials: 'Parte superior de malla técnica reciclada, mediasuela de espuma EVA reactiva y suela de caucho.',
      fitType: 'Horma regular. Si estás entre dos tallas, elige la mayor.',
      origin: 'Diseñado por TenisIvan.',
      ecoDetails: 'Malla fabricada con un 60% de poliéster reciclado.'
    },
    microcopyUrgency: 'Quedan pocos pares en 37 y 42.',
    lifestyleIndex: 0
  }),
  sneaker({
    id: 'volt-pace',
    title: 'Volt Pace',
    subtitle: 'Tenis de running con placa flexible para ganar ritmo',
    category: 'running',
    subcategory: 'Running',
    targetGender: 'Mujer',
    price: 399900,
    isNew: true,
    badge: 'Nuevo',
    cardColor: '#e6fbb0',
    rating: 4.8,
    reviewCount: 96,
    colors: [
      { id: 'multi', name: 'Multicolor Pop', colorHex: '#7c3aed', inStock: true, image: img('1608231387042-66d1773070a5') },
      { id: 'blue', name: 'Azul Eléctrico', colorHex: '#2563eb', inStock: true, image: img('1551107696-a4b0c5a0d9a2') }
    ],
    sizes: buildSizes(['43', '44'], ['35']),
    hook: 'Una placa flexible en la mediasuela que te empuja hacia delante: más ritmo con el mismo esfuerzo.',
    storytelling: 'Las Volt Pace nacieron para quienes quieren bajar su marca personal sin renunciar a la comodidad. Su horma está pensada para pies estrechos y el talón acolchado evita rozaduras desde el primer día.',
    styleBenefits: {
      whenToWear: 'Series, tiradas rápidas y carreras populares.',
      howToStyle: 'Con mallas y una sudadera corta para un look deportivo con color.',
      comfortVibe: 'Respuesta viva y sujeción firme en el medio pie.'
    },
    technicalSpecs: {
      materials: 'Malla tejida, placa de nylon flexible y suela de caucho de alta abrasión.',
      fitType: 'Horma femenina, algo estrecha. Fiel a la talla.',
      origin: 'Diseñado por TenisIvan.'
    },
    microcopyUrgency: 'Lanzamiento nuevo: envío gratis en tu primer par.',
    lifestyleIndex: 1
  }),
  sneaker({
    id: 'aero-run',
    title: 'Aero Run',
    subtitle: 'Running de diario con amortiguación extra en el talón',
    category: 'running',
    subcategory: 'Running',
    targetGender: 'Hombre',
    price: 439900,
    cardColor: '#c9ecff',
    rating: 4.7,
    reviewCount: 203,
    colors: [
      { id: 'grey', name: 'Gris Asfalto', colorHex: '#8d99ae', inStock: true, image: img('1460353581641-37baddab0fa2') },
      { id: 'black', name: 'Negro Total', colorHex: '#1f1f1f', inStock: true, image: img('1543508282-6319a3e2621f') }
    ],
    sizes: buildSizes(['35', '36'], ['43']),
    hook: 'Kilómetros y kilómetros sin dolor de rodillas: el talón extra acolchado absorbe cada impacto.',
    storytelling: 'Las Aero Run son el tenis que no te falla: cómodas desde el primer día, resistentes al desgaste y con un diseño limpio que también funciona fuera del entrenamiento.',
    styleBenefits: {
      whenToWear: 'Rodajes suaves, caminatas largas y uso diario.',
      howToStyle: 'Con pants, shorts o jeans rectos.',
      comfortVibe: 'Amortiguación mullida y pisada estable.'
    },
    technicalSpecs: {
      materials: 'Malla de doble capa, espuma de doble densidad y suela de caucho carbono.',
      fitType: 'Horma amplia. Fiel a la talla.',
      origin: 'Diseñado por TenisIvan.'
    },
    microcopyUrgency: 'Solo 2 pares en talla 43.',
    lifestyleIndex: 2
  }),
  sneaker({
    id: 'hoop-high-85',
    title: "Hoop High '85",
    subtitle: 'Bota de basket de caña alta en piel con colores clásicos',
    category: 'basket',
    subcategory: 'Basket',
    targetGender: 'Unisex',
    price: 599900,
    badge: 'Edición limitada',
    cardColor: '#e4dcff',
    rating: 4.9,
    reviewCount: 518,
    colors: [
      { id: 'chicago', name: 'Rojo & Negro', colorHex: '#c1121f', inStock: true, image: img('1595341888016-a392ef81b7de') },
      { id: 'royal', name: 'Azul Royal', colorHex: '#1d4ed8', inStock: true, image: img('1607522370275-f14206abe5d3') }
    ],
    sizes: buildSizes(['35', '44'], ['39', '40', '41']),
    hook: 'El clásico de cancha que nunca pasa de moda, ahora en edición limitada.',
    storytelling: "Inspiradas en las botas de basket de mediados de los 80, las Hoop High '85 combinan piel de calidad, caña alta acolchada y una suela con pivote que funciona igual de bien en la cancha que en la calle.",
    styleBenefits: {
      whenToWear: 'Para destacar: salir, conciertos o tu partido de los domingos.',
      howToStyle: 'Con jeans holgados o cargos para que la caña se vea.',
      comfortVibe: 'Sujeción firme del tobillo y plantilla acolchada.'
    },
    technicalSpecs: {
      materials: 'Piel con acabado liso, forro textil y suela de caucho con círculo de pivote.',
      fitType: 'Fiel a la talla. Los primeros días la piel se adapta a tu pie.',
      origin: 'Diseñado por TenisIvan.'
    },
    microcopyUrgency: 'Edición limitada: quedan pocos pares en 39, 40 y 41.',
    lifestyleIndex: 3
  }),
  sneaker({
    id: 'fly-court-mid',
    title: 'Fly Court Mid',
    subtitle: 'Caña media para jugar y para lucir',
    category: 'basket',
    subcategory: 'Basket',
    targetGender: 'Hombre',
    price: 539900,
    originalPrice: 639900,
    cardColor: '#ffdcc2',
    rating: 4.6,
    reviewCount: 145,
    colors: [
      { id: 'orange', name: 'Naranja Volcán', colorHex: '#f97316', inStock: true, image: img('1539185441755-769473a23570') },
      { id: 'white', name: 'Blanco Hueso', colorHex: '#f5f0e6', inStock: true, image: img('1600185365483-26d7a4cc7519') }
    ],
    sizes: buildSizes(['35', '36', '37']),
    hook: 'Amortiguación de cancha con un diseño que roba miradas.',
    storytelling: 'Las Fly Court Mid toman lo mejor del basket moderno, como la cámara de aire en el talón y la caña media acolchada, y lo llevan a un tenis que puedes usar todo el día.',
    styleBenefits: {
      whenToWear: 'Pickup games, entrenamiento y calle.',
      howToStyle: 'Con shorts de basket o pants de nylon.',
      comfortVibe: 'Rebote en el talón y buena estabilidad lateral.'
    },
    technicalSpecs: {
      materials: 'Sintético reforzado, malla en lengüeta y suela de caucho en espiga.',
      fitType: 'Fiel a la talla.',
      origin: 'Diseñado por TenisIvan.'
    },
    microcopyUrgency: 'Precio especial por tiempo limitado.',
    lifestyleIndex: 0
  }),
  sneaker({
    id: 'retro-court-88',
    title: "Retro Court '88",
    subtitle: 'Tenis bajo de piel con alma vintage',
    category: 'retro',
    subcategory: 'Retro',
    targetGender: 'Unisex',
    price: 359900,
    originalPrice: 439900,
    badge: 'Favorito',
    cardColor: '#fff1b8',
    rating: 4.95,
    reviewCount: 340,
    colors: [
      { id: 'white-green', name: 'Blanco & Verde', colorHex: '#f1f1eb', inStock: true, image: img('1595950653106-6c9ebd614d3a') },
      { id: 'white-navy', name: 'Blanco & Marino', colorHex: '#1b2a4a', inStock: true, image: img('1560769629-975ec94e6a86') },
      { id: 'all-white', name: 'Blanco Total', colorHex: '#f8f8f6', inStock: true, image: img('1549298916-b41d501d3772') }
    ],
    sizes: buildSizes([], ['36', '42']),
    hook: 'El tenis blanco que combina con absolutamente todo.',
    storytelling: "Inspirados en las canchas de los 80, los Retro Court '88 tienen la estética vintage que te gusta y la comodidad que esperas hoy: plantilla de memory foam y forro transpirable. Sin periodo de adaptación.",
    styleBenefits: {
      whenToWear: 'Todos los días: escuela, trabajo, viajes o salir.',
      howToStyle: 'Con jeans, vestidos, pantalones anchos o shorts. Siempre funcionan.',
      comfortVibe: 'Plantilla mullida y puntera amplia.'
    },
    technicalSpecs: {
      materials: 'Piel con detalles en ante y suela de caucho vulcanizado.',
      fitType: 'Fiel a la talla.',
      origin: 'Diseñado por TenisIvan.'
    },
    microcopyUrgency: 'Solo 2 pares en 36 y 42.',
    lifestyleIndex: 1
  }),
  sneaker({
    id: 'clean-court',
    title: 'Clean Court',
    subtitle: 'Minimalistas, blancos y con plataforma ligera',
    category: 'urbanos',
    subcategory: 'Urbanos',
    targetGender: 'Mujer',
    price: 319900,
    cardColor: '#ffd6e7',
    rating: 4.7,
    reviewCount: 188,
    colors: [
      { id: 'white', name: 'Blanco Puro', colorHex: '#ffffff', inStock: true, image: img('1600185365926-3a2ce3cdb9eb') },
      { id: 'cream', name: 'Crema', colorHex: '#f3e9d2', inStock: true, image: img('1597045566677-8cf032ed6634') }
    ],
    sizes: buildSizes(['43', '44'], ['38']),
    hook: 'Tu par blanco de confianza, con 3 cm extra de altura sin perder comodidad.',
    storytelling: 'Las Clean Court tienen líneas limpias, una plataforma ligera y una plantilla acolchada. Son el básico que levanta cualquier outfit.',
    styleBenefits: {
      whenToWear: 'Día a día, oficina casual y fines de semana.',
      howToStyle: 'Con faldas, vestidos, jeans mom o trajes sastre relajados.',
      comfortVibe: 'Plataforma ligera que no pesa al caminar.'
    },
    technicalSpecs: {
      materials: 'Piel sintética de alta calidad y suela de goma con plataforma.',
      fitType: 'Fiel a la talla.',
      origin: 'Diseñado por TenisIvan.'
    },
    microcopyUrgency: 'Quedan pocos pares en 38.',
    lifestyleIndex: 2
  }),
  sneaker({
    id: 'cloud-step',
    title: 'Cloud Step',
    subtitle: 'Urbanos con suela chunky y bloques de color',
    category: 'urbanos',
    subcategory: 'Urbanos',
    targetGender: 'Unisex',
    price: 379900,
    isNew: true,
    badge: 'Nuevo',
    cardColor: '#e6fbb0',
    rating: 4.8,
    reviewCount: 74,
    colors: [
      { id: 'pop', name: 'Bloques Pop', colorHex: '#22c55e', inStock: true, image: img('1606107557195-0e29a4b5b4aa') },
      { id: 'grey', name: 'Gris Perla', colorHex: '#d4d4d8', inStock: true, image: img('1584735175315-9d5df23860e6') }
    ],
    sizes: buildSizes(['35'], ['41']),
    hook: 'Suela chunky, colores que se notan y la sensación de caminar sobre nubes.',
    storytelling: 'Las Cloud Step mezclan la estética chunky de los 2000 con una espuma ultraligera. Pisan fuerte, pesan poco y combinan con tu lado más atrevido.',
    styleBenefits: {
      whenToWear: 'Para el día a día cuando quieres que tus tenis sean el centro del look.',
      howToStyle: 'Con cargos, pants anchos o shorts y calcetas blancas.',
      comfortVibe: 'Espuma gruesa y ligera, muy amortiguada.'
    },
    technicalSpecs: {
      materials: 'Combinación de malla y gamuza sintética, suela de EVA chunky.',
      fitType: 'Fiel a la talla.',
      origin: 'Diseñado por TenisIvan.'
    },
    microcopyUrgency: 'Recién llegados: el color Bloques Pop vuela.',
    lifestyleIndex: 3
  }),
  sneaker({
    id: 'kickflip-low',
    title: 'Kickflip Low',
    subtitle: 'Skate clásico de lona y gamuza con suela waffle',
    category: 'skate',
    subcategory: 'Skate',
    targetGender: 'Unisex',
    price: 279900,
    cardColor: '#c9ecff',
    rating: 4.8,
    reviewCount: 266,
    colors: [
      { id: 'black', name: 'Negro & Blanco', colorHex: '#111111', inStock: true, image: img('1525966222134-fcfa99b8ae77') }
    ],
    sizes: buildSizes([], ['40']),
    hook: 'Agarre total sobre la tabla y estilo que aguanta cualquier caída.',
    storytelling: 'Los Kickflip Low son el skate de siempre: lona resistente, gamuza en las zonas de roce y suela waffle vulcanizada que se pega a la lija.',
    styleBenefits: {
      whenToWear: 'Skate, escuela, conciertos y todos los días.',
      howToStyle: 'Con jeans holgados, bermudas y calcetas altas.',
      comfortVibe: 'Suela plana y flexible con buena sensibilidad.'
    },
    technicalSpecs: {
      materials: 'Lona y gamuza, suela de caucho vulcanizado tipo waffle.',
      fitType: 'Fiel a la talla.',
      origin: 'Diseñado por TenisIvan.'
    },
    microcopyUrgency: 'Solo 2 pares en 40.',
    lifestyleIndex: 0
  }),
  sneaker({
    id: 'blaze-trail',
    title: 'Blaze Trail',
    subtitle: 'Urbanos de inspiración outdoor con suela de tacos',
    category: 'urbanos',
    subcategory: 'Urbanos',
    targetGender: 'Hombre',
    price: 499900,
    cardColor: '#ffdcc2',
    rating: 4.6,
    reviewCount: 58,
    colors: [
      { id: 'sand', name: 'Arena', colorHex: '#d6b88d', inStock: true, image: img('1515955656352-a1fa3ffcd111') },
      { id: 'black', name: 'Negro Carbón', colorHex: '#262626', inStock: true, image: img('1587563871167-1ee9c731aefb') }
    ],
    sizes: buildSizes(['35', '36'], ['44']),
    hook: 'De la ciudad al cerro sin cambiarte de tenis.',
    storytelling: 'Las Blaze Trail tienen suela de tacos con buen agarre, refuerzos en la puntera y un estilo gorpcore que funciona igual en la oficina que en una caminata.',
    styleBenefits: {
      whenToWear: 'Escapadas, días de lluvia y uso urbano.',
      howToStyle: 'Con pantalones técnicos, cargos o jeans rectos.',
      comfortVibe: 'Estables y protectoras, con un acolchado firme.'
    },
    technicalSpecs: {
      materials: 'Malla resistente al agua, refuerzos de TPU y suela de caucho con tacos.',
      fitType: 'Horma amplia. Fiel a la talla.',
      origin: 'Diseñado por TenisIvan.'
    },
    microcopyUrgency: 'Últimos pares en 44.',
    lifestyleIndex: 1
  })
];

// Suggest two other sneakers, same style first
for (const product of products) {
  product.pairingSuggestions = [
    ...products.filter((p) => p.id !== product.id && p.category === product.category),
    ...products.filter((p) => p.id !== product.id && p.category !== product.category)
  ]
    .slice(0, 2)
    .map((p) => ({ productId: p.id, title: p.title, price: p.price, image: p.heroImage }));
}

export const PRODUCTS_CATALOG: Product[] = products;
