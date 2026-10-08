import { Product, CategoryTreeItem, VisualGuideShot } from '../types';

export const BRAND_INFO = {
  name: 'NOMAD & CO.',
  tagline: 'Ropa casual y calzado urbano para vivir en movimiento',
  target: 'Jóvenes y adultos jóvenes de 16 a 40 años',
  voice: 'Juvenil, cercano, auténtico, relajado y optimista',
  uspList: [
    'Envíos rápidos 24/48h y gratis desde $49',
    '30 días de cambios y devoluciones sin coste ni preguntas',
    'Materiales de alta durabilidad y procesos eco-conscientes',
    'Pagas en 3 cuotas sin intereses con Klarna o PayPal'
  ]
};

export const CATEGORIES_TREE: CategoryTreeItem[] = [
  {
    id: 'mujer',
    name: 'Mujer',
    iconName: 'Sparkles',
    slug: 'mujer',
    description: 'Siluetas fluidas, denim contemporáneo y básicos con actitud.',
    subcategories: [
      { name: 'Vestidos & Monos', slug: 'vestidos-monos', description: 'Vestidos camiseros, midi fluidos y monos casuales.', popular: true },
      { name: 'Camisetas & Tops', slug: 'camisetas-tops', description: 'Tops básicos, camisetas gráficas y crop tops relajados.' },
      { name: 'Sudaderas & Hoodies', slug: 'sudaderas-hoodies', description: 'Hoodies oversize de felpa pesada y corte relaxed.' },
      { name: 'Jeans & Pantalones', slug: 'jeans-pantalones', description: 'Cargos utility, wide leg, mom jeans y rectos.', popular: true },
      { name: 'Chaquetas & Abrigos', slug: 'chaquetas-abrigos', description: 'Bombers acolchadas, sobrecamisas y cazadoras denim.' },
      { name: 'Calzado & Zapatillas', slug: 'calzado-mujer', description: 'Retro sneakers, plataformas y sandalias urbanas.', popular: true }
    ]
  },
  {
    id: 'hombre',
    name: 'Hombre',
    iconName: 'User',
    slug: 'hombre',
    description: 'Streetwear limpio, cortes holgados y durabilidad diaria.',
    subcategories: [
      { name: 'Camisetas & Polos', slug: 'camisetas-polos', description: 'Cortes boxy fit de alto gramaje y colores neutros.', popular: true },
      { name: 'Sudaderas & Hoodies', slug: 'sudaderas-hombre', description: 'Felpa perchada de 420 GSM, sin cordones molestos.' },
      { name: 'Sobrecamisas & Shackets', slug: 'sobrecamisas', description: 'Tejidos de pana, sarga pesada y lino lavado.' },
      { name: 'Jeans & Cargos', slug: 'jeans-cargos-hombre', description: 'Loose fit, cargo táctico y denim rígido.', popular: true },
      { name: 'Chaquetas & Cortavientos', slug: 'chaquetas-hombre', description: 'Bombers técnicas y chaquetas estilo worker.' },
      { name: 'Zapatillas & Zapatos', slug: 'calzado-hombre', description: 'Sneakers de suela cupsole y zapatos casuales.', popular: true }
    ]
  },
  {
    id: 'calzado',
    name: 'Calzado Urbano',
    iconName: 'Footprints',
    slug: 'calzado',
    badge: 'Trending',
    description: 'Zapatillas de estética retro y suelas ergonómicas todoterreno.',
    subcategories: [
      { name: 'Sneakers Retro Court', slug: 'retro-court', description: 'Inspiración baloncesto de los 80 con cuero y ante.', popular: true },
      { name: 'Chunky & Platform', slug: 'chunky-platform', description: 'Volumen arquitectónico y máxima amortiguación.' },
      { name: 'Skate & Canvas', slug: 'skate-canvas', description: 'Lona reforzada con costuras dobles para uso diario.' },
      { name: 'Sandalias & Slides', slug: 'sandalias-slides', description: 'Diseño anatómico para días calurosos y descanso.' },
      { name: 'Cuidado del Calzado', slug: 'cuidados-calzado', description: 'Sprays protectores hidrófugos y kits de limpieza.' }
    ]
  },
  {
    id: 'drops',
    name: 'Drops & Cápsulas',
    iconName: 'Flame',
    slug: 'drops',
    badge: 'Nuevo',
    description: 'Ediciones limitadas, colaboraciones y básicos de temporada.',
    subcategories: [
      { name: 'Colección "Urban Chill" 2026', slug: 'urban-chill', description: 'Prendas neutras combinables entre sí.', popular: true },
      { name: 'Básicos Pesados (Heavyweight)', slug: 'heavyweight-basics', description: 'Gramaje premium para prendas indestructibles.' },
      { name: 'Línea Eco-Conscious', slug: 'eco-conscious', description: '100% algodón orgánico GOTS y tintes naturales.' },
      { name: 'Get The Look (Outfits)', slug: 'get-the-look', description: 'Conjuntos completos con 15% de descuento.' }
    ]
  }
];

export const PRODUCTS_CATALOG: Product[] = [
  // 1. PRODUCTO 1: VESTIDO CASUAL O PRENDA DE TEMPORADA
  {
    id: 'vestido-sunday-chill',
    slug: 'vestido-camisero-sunday-chill-lino',
    title: 'Vestido Camisero Oversize "Sunday Chill"',
    subtitle: 'Lino europeo prelavado & algodón orgánico transpirable',
    category: 'mujer',
    subcategory: 'Vestidos & Monos',
    targetGender: 'Mujer',
    price: 59.95,
    originalPrice: 79.95,
    isNew: true,
    badge: 'Top Temporada',
    rating: 4.9,
    reviewCount: 128,
    heroImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
    colors: [
      { id: 'sand', name: 'Arena Cálido', colorHex: '#e5d7c3', inStock: true, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80' },
      { id: 'olive', name: 'Verde Salvia', colorHex: '#8f9779', inStock: true, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80' },
      { id: 'black', name: 'Negro Carbón', colorHex: '#262626', inStock: true, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80' }
    ],
    sizes: [
      { size: 'XS', available: true, stockCount: 4 },
      { size: 'S', available: true, stockCount: 8 },
      { size: 'M', available: true, stockCount: 3 },
      { size: 'L', available: true, stockCount: 6 },
      { size: 'XL', available: true, stockCount: 2 }
    ],
    galleryImages: [
      {
        type: 'studio',
        label: 'Toma Frontal Estudio',
        url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
        description: 'Fondo neutro cálido para apreciar el corte camisero limpio, cuello bowling y caída natural sin pliegues forzados.'
      },
      {
        type: 'lifestyle',
        label: 'Lifestyle Urbano',
        url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80',
        description: 'Modelo en terraza de cafetería con luz solar suave, mostrando naturalidad, comodidad al sentarse y versatilidad casual.'
      },
      {
        type: 'texture',
        label: 'Macro Textura Lino',
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
        description: 'Detalle de costuras francesas dobles, botones de coco mate y la textura rústica suave del lino con algodón.'
      },
      {
        type: 'lookbook',
        label: 'Get The Look Completo',
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
        description: 'Combinado con sneakers blancos Subway \'88 y bolso tote de algodón para inspirar la compra cruzada.'
      }
    ],
    hook: 'El vestido con el que te vistes en 30 segundos y parece que pensaste tu outfit toda la semana.',
    storytelling: 'Sabes esos días en los que no quieres complicarte la vida frente al espejo pero tampoco quieres perder ni un ápice de estilo? Sunday Chill nació exactamente para eso. Confeccionado en una mezcla súper ligera de lino europeo y algodón orgánico prelavado, tiene esa caída relajada que se adapta a ti sin apretar ni marcar. No requiere tacones ni accesorios imposibles: con tus zapatillas favoritas tienes un lookazo impecable de lunes a domingo.',
    styleBenefits: {
      whenToWear: 'Desde un brunch improvisado con amigos hasta una jornada de trabajo híbrido o una escapada de fin de semana donde solo llevas equipaje de mano.',
      howToStyle: 'Llévalo suelto con zapatillas retro y calcetines vistos para un rollo street desenfadado; o ciñe el cinturón a juego y añade una cazadora denim para salir a cenar.',
      comfortVibe: 'Tacto ultrasuave que no pica. Además, el lino noble gana suavidad y carácter con cada lavado.'
    },
    technicalSpecs: {
      materials: '65% Algodón Orgánico certificado GOTS, 35% Lino Europeo prelavado.',
      fitType: 'Oversize relajado. Si prefieres un calce más ajustado al pecho, recomendamos pedir una talla menos.',
      origin: 'Confeccionado éticamente en Portugal.',
      ecoDetails: 'Tintes al agua libres de químicos pesados. Ahorro estimado de un 45% de agua en proceso de teñido.'
    },
    careInstructions: [
      'Lavar a máquina en programa delicado a máximo 30°C.',
      'Lavar del revés con colores similares.',
      'Secar al aire sobre percha (evitar secadora para mantener la fibra natural intacta).',
      'Planchar con vapor a baja temperatura o disfrutar de la arruga noble del lino.'
    ],
    microcopyUrgency: '⚡ Quedan pocas unidades en tallas M y XL. Envío express gratis hoy.',
    pairingSuggestions: [
      {
        productId: 'sneakers-subway-88',
        title: 'Sneakers Retro "Subway \'88"',
        price: 89.90,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80'
      },
      {
        productId: 'jean-nomad-98',
        title: 'Cazadora Denim Oversize Raw',
        price: 74.90,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },

  // 2. PRODUCTO 2: PANTALÓN, JEAN O BÁSICO DURADERO
  {
    id: 'jean-nomad-98',
    slug: 'jean-cargo-relaxed-nomad-98',
    title: 'Jean Cargo Relaxed Fit "Nomad \'98"',
    subtitle: 'Denim Heavyweight 13.5 oz con 6 bolsillos funcionales',
    category: 'hombre',
    subcategory: 'Jeans & Cargos',
    targetGender: 'Unisex',
    price: 69.90,
    originalPrice: 85.00,
    isBestSeller: true,
    badge: 'Top Ventas',
    rating: 4.8,
    reviewCount: 214,
    heroImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
    colors: [
      { id: 'vintage-blue', name: 'Azul Vintage Washed', colorHex: '#4a6572', inStock: true, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80' },
      { id: 'washed-black', name: 'Negro Lavado', colorHex: '#343434', inStock: true, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80' },
      { id: 'raw-indigo', name: 'Raw Índigo Profundo', colorHex: '#1d2731', inStock: true, image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80' }
    ],
    sizes: [
      { size: '28', available: true, stockCount: 5 },
      { size: '30', available: true, stockCount: 12 },
      { size: '32', available: true, stockCount: 2 },
      { size: '34', available: true, stockCount: 7 },
      { size: '36', available: true, stockCount: 4 }
    ],
    galleryImages: [
      {
        type: 'studio',
        label: 'Toma Frontal Estudio',
        url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
        description: 'Tiro medio-alto y pierna ancha recta que descansa perfectamente sobre cualquier tipo de zapatilla sin arrastrar.'
      },
      {
        type: 'lifestyle',
        label: 'Lifestyle Streetwear',
        url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80',
        description: 'Modelo en entorno urbano en movimiento, demostrando amplitud de paso, caída del tejido y estética noventera.'
      },
      {
        type: 'texture',
        label: 'Detalle Bolsillos & Denim',
        url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1000&q=80',
        description: 'Detalle del fuelle del bolsillo cargo, cremallera metálica YKK y remaches de cobre reforzados en zonas de tensión.'
      },
      {
        type: 'lookbook',
        label: 'Outfit Completo Casual',
        url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80',
        description: 'Combinado con hoodie gris jaspeado y gorra beanie para visualizar el fit completo del lookbook.'
      }
    ],
    hook: 'Olvídate de los vaqueros tiesos e incómodos. Este cargo está diseñado para que vivas en él.',
    storytelling: 'Encontrar un jean que no apriete en la cintura al sentarte, que aguante años de trote y que además tenga el ancho noventero exacto parecía misión imposible. Por eso diseñamos el Nomad \'98. Rescatamos el auténtico denim de 13.5 onzas resistente de la vieja escuela y le añadimos un 1% de elastano técnico que no notas a la vista pero que agradeces en cada movimiento. Con 6 bolsillos bien ubicados donde tu teléfono y tus llaves caben de verdad sin abultar ni deformar la prenda.',
    styleBenefits: {
      whenToWear: 'Para tu día a día: desde clases en la universidad o jornadas creativas de trabajo, hasta conciertos y fines de semana de skate o viaje.',
      howToStyle: 'Llévalo con una camiseta básica blanca heavyweight de corte boxy y zapatillas retro. ¿Hace fresco? Súmale una sudadera oversize o una sobrecamisa abierta.',
      comfortVibe: 'Corte holgado (relaxed fit) con libertad total de movimientos. Nada de rozaduras ni presiones innecesarias.'
    },
    technicalSpecs: {
      materials: '99% Algodón duradero BCI (Better Cotton Initiative), 1% Elastano elástico.',
      fitType: 'Tiro medio, pierna holgada con ligera caída recta. Calce fiel a la talla habitual.',
      origin: 'Lavado ecológico con ozono en Valencia, España (reduce un 60% el uso de agua frente al lavado convencional).',
      ecoDetails: 'Botones y remaches de latón reciclado sin galvanizado químico tóxico.'
    },
    careInstructions: [
      'Lavar del revés para preservar el tono de lavado vintage.',
      'Agua fría (máx. 30°C) con detergente suave.',
      'No usar secadora: colgar a la sombra.',
      'Dato pro: no necesitas lavarlo tras cada puesta; ventilarlo al aire mantiene el denim fresco y duradero.'
    ],
    microcopyUrgency: '🔥 Más de 200 personas compraron este modelo este mes. Talla 32 casi agotada.',
    pairingSuggestions: [
      {
        productId: 'sneakers-subway-88',
        title: 'Sneakers Retro "Subway \'88"',
        price: 89.90,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80'
      },
      {
        productId: 'hoodie-heavyweight',
        title: 'Hoodie Boxy 450 GSM Raw',
        price: 54.90,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },

  // 3. PRODUCTO 3: CALZADO DESTACADO (SNEAKERS URBANOS RETRO)
  {
    id: 'sneakers-subway-88',
    slug: 'sneakers-urbanos-retro-subway-88',
    title: 'Sneakers Urbanos Retro Court "Subway \'88"',
    subtitle: 'Piel vacuna certificada LWG con refuerzos en ante y suela vulcanizada',
    category: 'calzado',
    subcategory: 'Sneakers Retro Court',
    targetGender: 'Unisex',
    price: 89.90,
    originalPrice: 110.00,
    badge: 'Favorito del Equipo',
    rating: 4.95,
    reviewCount: 340,
    heroImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
    colors: [
      { id: 'white-green', name: 'Blanco Tiza & Verde Bosque', colorHex: '#f1f1eb', inStock: true, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80' },
      { id: 'white-navy', name: 'Blanco & Azul Marino', colorHex: '#1b2a4a', inStock: true, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80' },
      { id: 'all-white', name: 'Monocromo Blanco Crudo', colorHex: '#f8f8f6', inStock: true, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80' }
    ],
    sizes: [
      { size: '37 EU', available: true, stockCount: 3 },
      { size: '38 EU', available: true, stockCount: 6 },
      { size: '39 EU', available: true, stockCount: 8 },
      { size: '40 EU', available: true, stockCount: 2 },
      { size: '41 EU', available: true, stockCount: 9 },
      { size: '42 EU', available: true, stockCount: 11 },
      { size: '43 EU', available: true, stockCount: 1 },
      { size: '44 EU', available: true, stockCount: 5 }
    ],
    galleryImages: [
      {
        type: 'studio',
        label: 'Toma Lateral Perfil',
        url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
        description: 'Perfil limpio de la silueta en 3/4 sobre fondo blanco neutro para apreciar la puntera perforada y la lengüeta acolchada.'
      },
      {
        type: 'lifestyle',
        label: 'En Acción Urbana',
        url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1000&q=80',
        description: 'Caminando por el pavimento de la ciudad con jeans con vuelta, transmitiendo versatilidad todoterreno.'
      },
      {
        type: 'texture',
        label: 'Macro Cuero & Puntera',
        url: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=1000&q=80',
        description: 'Primer plano del grano natural del cuero vacuno suave y el ante afelpado en puntera con costuras perimetrales reforzadas.'
      },
      {
        type: 'lookbook',
        label: 'Suela & Interior Ergonómico',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
        description: 'Detalle de la suela de goma vulcanizada en espiga y plantilla de Memory Foam extraíble amortiguadora.'
      }
    ],
    hook: 'Tus zapatillas compañeras de 15.000 pasos al día: tan limpias que elevan cualquier outfit, tan cómodas que no querrás quitártelas.',
    storytelling: 'Inspiradas en las canchas de baloncesto y el asfalto de finales de los 80, las Subway \'88 combinan lo mejor de la estética retro con la tecnología de confort actual. ¿El problema de muchas sneakers vintage? Que son duras como piedras. Nosotros le añadimos una plantilla ergonómica de Memory Foam viscoelástica de alta densidad y forro interior transpirable. No tienes que "amansarlas" ni sufrir ampollas: son suaves como un guante desde el minuto uno.',
    styleBenefits: {
      whenToWear: 'Tu calzado comodín definitivo: perfectas para patearte la ciudad, viajar, salir de cañas o ir a trabajar con un toque informal y arreglado.',
      howToStyle: 'Combinan con todo: van de diez con vestidos fluidos, bermudas veraniegas, pantalones de pinzas anchos o los cargos Nomad \'98.',
      comfortVibe: 'Suela con absorción de impactos y puntera redonda espaciosa para que los dedos descansen de forma natural.'
    },
    technicalSpecs: {
      materials: 'Corte exterior en 100% Piel vacuna certificada Leather Working Group (LWG) Gold con detalles en ante suave. Suela de 100% Caucho vulcanizado antideslizante.',
      fitType: 'Tallaje estándar europeo. Si dudas entre dos tallas, te sugerimos elegir la mayor.',
      origin: 'Fabricado artesanalmente en Elche (España).',
      ecoDetails: 'Curtición de bajo impacto ambiental con circuito cerrado de agua y pegamentos base agua sin disolventes nocivos.'
    },
    careInstructions: [
      'Limpiar la piel con una toallita húmeda o paño de microfibra con jabón neutro.',
      'Para las partes de ante, cepillar en seco con un cepillo de cerdas suaves.',
      'Recomendamos aplicar spray protector impermeabilizante antes de estrenar.',
      'Plantilla extraíble: se puede lavar a mano con agua tibia.'
    ],
    microcopyUrgency: '👟 Talla 43 solo 1 par disponible. Incluye bolsa de viaje de algodón de regalo.',
    pairingSuggestions: [
      {
        productId: 'vestido-sunday-chill',
        title: 'Vestido Camisero Sunday Chill',
        price: 59.95,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'
      },
      {
        productId: 'jean-nomad-98',
        title: 'Jean Cargo Nomad \'98',
        price: 69.90,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },

  // 4. PRODUCTO COMPLEMENTARIO: HOODIE BOXy HEAVYWEIGHT
  {
    id: 'hoodie-heavyweight',
    slug: 'hoodie-boxy-heavyweight-450gsm',
    title: 'Sudadera Hoodie Boxy "Heavyweight 450"',
    subtitle: '100% Algodón orgánico de 450 GSM sin cordones molestos',
    category: 'hombre',
    subcategory: 'Sudaderas & Hoodies',
    targetGender: 'Unisex',
    price: 64.95,
    originalPrice: 75.00,
    isNew: false,
    badge: 'Esencial',
    rating: 4.88,
    reviewCount: 95,
    heroImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    colors: [
      { id: 'heather-grey', name: 'Gris Jaspeado', colorHex: '#b2b2b2', inStock: true, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80' },
      { id: 'washed-black', name: 'Negro Ceniza', colorHex: '#262626', inStock: true, image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80' }
    ],
    sizes: [
      { size: 'S', available: true, stockCount: 4 },
      { size: 'M', available: true, stockCount: 8 },
      { size: 'L', available: true, stockCount: 15 },
      { size: 'XL', available: true, stockCount: 3 }
    ],
    galleryImages: [
      {
        type: 'studio',
        label: 'Estudio Frontal',
        url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
        description: 'Capucha con doble forro que se mantiene armada y hombros caídos sutiles.'
      },
      {
        type: 'lifestyle',
        label: 'Lifestyle Urbano',
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
        description: 'Corte boxy moderno que no se enrolla en la cintura.'
      }
    ],
    hook: 'El abrazo que necesitas en los días grises: felpa pesada que mantiene su forma lavado tras lavado.',
    storytelling: '¿Cansado de sudaderas que tras dos lavados parecen papel de fumar? Creamos este hoodie con felpa perchada francesa de 450 gramos por metro cuadrado. Tiene cuerpo, tiene presencia y una capucha con doble capa que no se queda aplastada.',
    styleBenefits: {
      whenToWear: 'Días frescos, viajes de aeropuerto y sesiones de tarde sin prisas.',
      howToStyle: 'Con jeans baggy y tus zapatillas Subway \'88 favoritas.',
      comfortVibe: 'Interior con tacto melocotón cepillado súper suave.'
    },
    technicalSpecs: {
      materials: '100% Algodón orgánico peinado (450 GSM).',
      fitType: 'Boxy crop sutil (ancho de pecho pero largo ajustado para no crear bulto).',
      origin: 'Portugal.',
      ecoDetails: 'Certificación Oeko-Tex Standard 100.'
    },
    careInstructions: ['Lavar en frío', 'No planchar estampados', 'Secado plano'],
    microcopyUrgency: '⭐ Stock limitado por lotes artesanales de confección.',
    pairingSuggestions: []
  }
];

export const VISUAL_GUIDE_SHOTS: VisualGuideShot[] = [
  {
    id: 'shot-studio-neutral',
    title: '1. Toma de Estudio con Fondo Neutro (Frontal & Espalda)',
    purpose: 'Mostrar la prenda pura, sin distracciones estéticas, garantizando fidelidad de color, caída real y proporciones.',
    exampleImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    specs: {
      angle: 'Nivel del pecho / cadera (cámara a 1.20m), lente 85mm o 50mm para cero distorsión de perspectiva.',
      lighting: 'Luz suave difusa con dos cajas octogonales (octabox) y reflector de relleno; sombras muy suaves.',
      background: 'Fondo infinito en color Warm Sand (#F4EFEB), Off-White (#F8F7F4) o Gris Perla neutro (nunca blanco puro clínico 255,255,255).',
      modelDirection: 'Postura relajada, hombros sueltos, manos naturales (no poses rígidas de maniquí de los 2000).'
    },
    dos: [
      'Indicar claramente: "El modelo mide 1.83m y lleva la talla L".',
      'Capturar tanto la vista frontal como la trasera y el perfil 3/4.',
      'Mantener calibración de color (perfil sRGB) para que lo que reciba el cliente sea idéntico a la pantalla.'
    ],
    donts: [
      'No usar filtros o presets de color de Instagram que cambien la tonalidad de la tela.',
      'No recortar los pies en tomas de cuerpo entero si la prenda requiere contexto de altura.',
      'No sobreiluminar hasta quemar los detalles de textura.'
    ]
  },
  {
    id: 'shot-lifestyle-urban',
    title: '2. Toma de Estilo de Vida (Lifestyle en Contexto Real)',
    purpose: 'Conectar emocionalmente con el público de 16 a 40 años: proyectar cómo se siente usar la prenda en una situación real.',
    exampleImage: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    specs: {
      angle: 'Ángulo dinámico, cámara ligeramente en movimiento o ángulo de testigo (candid shot).',
      lighting: 'Luz natural de mañana o "golden hour" suave en exterior urbano (calles limpias, cafetería, parque).',
      background: 'Entornos urbanos contemporáneos desenfocados (bokeh suave f/2.0 a f/2.8) para destacar al modelo.',
      modelDirection: 'Risas espontáneas, tomando un café, caminando o en una actitud segura y cercana.'
    },
    dos: [
      'Modelos de edades acordes al target (18-38 años) con fisonomías diversas y peinados naturales.',
      'Transmitir el tono de la marca: prendas que se disfrutan, no ropa intocable de alta costura.',
      'Utilizar atrezo creíble (auriculares de diadema, taza de café, bicicleta, tote bag).'
    ],
    donts: [
      'No usar fotos de banco de imágenes genéricas que se noten impostadas o corporativas.',
      'Evitar poses hiper-sexualizadas o excesivamente dramáticas ajenas a la moda casual.',
      'No dejar que el fondo compita en atención con la prenda.'
    ]
  },
  {
    id: 'shot-texture-macro',
    title: '3. Macro-Zoom al Tejido y Costuras (Texture Close-up)',
    purpose: 'Destruir la principal barrera de compra online ("¿Será de buena tela o transparentará y se romperá?").',
    exampleImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    specs: {
      angle: 'Plano detalle muy cerrado (Macro 1:1 o 90mm), ángulo a 45 grados para resaltar el relieve.',
      lighting: 'Luz lateral rasante para proyectar micro-sombras que revelen la trama del hilo, ribetes y botones.',
      background: 'La propia prenda extendida o sostenida con delicadeza por las manos del modelo.',
      modelDirection: 'Foco nítido en el detalle clave: el remache metálico, el ojal, el grano del cuero o la felpa.'
    },
    dos: [
      'Mostrar detalles de valor: cremalleras YKK, botones grabados, etiquetas de tela cosidas, doble pespunte.',
      'Permitir que el usuario haga zoom interactivo de hasta 2.5x en la web.',
      'Capturar la caída de la tela al doblarse sobre sí misma.'
    ],
    donts: [
      'No enfocar zonas con hilos sueltos o pelusas accidentales (hacer control de calidad antes del disparo).',
      'No comprimir la imagen en exceso para no pixelar el patrón textil.'
    ]
  },
  {
    id: 'shot-motion-video',
    title: '4. Toma en Movimiento / Micro-Video de Caída (3-5 Segundos)',
    purpose: 'Mostrar cómo fluye el tejido al caminar, sentarse o girar. El video aumenta la tasa de conversión en moda hasta un 32%.',
    exampleImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
    specs: {
      angle: 'Travelling suave o cámara estática mientras el modelo realiza un giro de 180° y 3 pasos hacia delante.',
      lighting: 'Luz continua de estudio con alto índice CRI (>95) o luz de día difusa constante.',
      background: 'Ciclorama neutro o suelo urbano con textura limpia.',
      modelDirection: 'Caminar con paso natural, meter una mano en el bolsillo del cargo o agitar sutilmente el vestido.'
    },
    dos: [
      'Micro-vídeos en bucle sin sonido que carguen en menos de 400ms (formato MP4/WebM ligero, menos de 2MB).',
      'Demostrar la elasticidad o la solidez del calzado al dar el paso.',
      'Activar el reproductor con hover o autoplay silencioso respetuoso.'
    ],
    donts: [
      'No usar videos largos con música estridente que sobresalte al usuario.',
      'No hacer movimientos de cámara bruscos o temblorosos.'
    ]
  },
  {
    id: 'shot-flatlay-look',
    title: '5. Flat Lay o "Shop The Look" (Outfit Completo)',
    purpose: 'Fomentar la venta cruzada (cross-selling) y aumentar el ticket promedio (AOV) mostrando cómo combinar la prenda.',
    exampleImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    specs: {
      angle: 'Cenital absoluto (top-down 90°) o montado en pared/maniquí invisible estilizado.',
      lighting: 'Luz superior suave y uniforme sin sombras duras bajo las prendas accesorias.',
      background: 'Superficie de hormigón claro pulido, madera clara o cartulina texturizada.',
      modelDirection: 'Composición armoniosa con la prenda protagonista al centro y accesorios alrededor con aire de respiración.'
    },
    dos: [
      'Incluir enlaces directos interactivos "Comprar el look" con 1 clic para añadir el conjunto entero.',
      'Mostrar prendas que respondan a la misma gama cromática (tonos tierra, escala monocromática o contrastes armónicos).',
      'Añadir complementos cotidianos como calcetines acanalados, gorras o gafas de sol.'
    ],
    donts: [
      'No amontonar demasiadas prendas que saturen la composición visual.',
      'No mezclar estilos incompatibles sin un propósito claro de estilismo.'
    ]
  },
  {
    id: 'shot-footwear-perspective',
    title: '6. Tomas Específicas de Calzado (El Triángulo de Oro: Lateral, Cenital y Suela)',
    purpose: 'En calzado, el usuario necesita verificar la altura de la suela, cómo se ve el pie desde arriba al mirar hacia abajo y el dibujo de la suela.',
    exampleImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    specs: {
      angle: 'Trilogía: 1) Lateral 100% puro para silueta; 2) Cenital (On-feet point of view); 3) Vista de suela en 45°.',
      lighting: 'Luz que realce el volumen de la entresuela y no aplane los paneles de diferentes materiales.',
      background: 'Fondo de estudio o suelo de asfalto/madera para foto en pie.',
      modelDirection: 'Pie apoyado con ángulo natural sobre un escalón o caminando hacia cámara.'
    },
    dos: [
      'Mostrar la foto "POV" (cómo te verás tú mismo al mirar tus propios pies al calzártelas).',
      'Mostrar la plantilla extraíble si aplica.',
      'Dejar ver el grosor y flexibilidad de la suela en flexión.'
    ],
    donts: [
      'No mostrar cordones desaliñados o anudados de forma descuidada.',
      'No omitir la vista trasera del talón (muchos usuarios se fijan en el contrafuerte).'
    ]
  }
];

export const PDP_STRUCTURE_BREAKDOWN = [
  {
    step: '1. Kicker & Breadcrumb (Migas de Pan)',
    rule: 'Texto limpio sin pills raras (Inicio / Mujer / Vestidos) para ubicación y SEO.',
    importance: 'Fundamental para que el usuario navegue hacia atrás sin tocar el botón del navegador.'
  },
  {
    step: '2. Título Persuasivo',
    rule: 'Fórmula: [Tipo de Prenda] + [Corte/Estilo] + [Nombre Icónico de Colección] + [Material clave].',
    importance: 'Distingue tu producto del genérico "Vestido azul" y construye valor de marca de inmediato.'
  },
  {
    step: '3. Precios y Cuotas Psicológicas',
    rule: 'Precio actual en tamaño dominante (bold), precio anterior tachado, % de ahorro y cálculo de cuotas (ej. "o 3 pagos de $19.98").',
    importance: 'Reduce la fricción de desembolso inicial y activa el gatillo de ahorro inteligente.'
  },
  {
    step: '4. Calificaciones y Opiniones Reales',
    rule: 'Estrellas con puntuación promedio + enlace directo a reseñas ("4.9 de 128 opiniones") + badge "Talla exacta".',
    importance: 'El 88% de los compradores lee reseñas antes de añadir ropa a la cesta de compra.'
  },
  {
    step: '5. Selector de Variantes (Colores & Tallas)',
    rule: 'Swatches de color circulares con borde al seleccionar y nombre del color textual. Selector de tallas con stock bajo visible ("¡Solo 2 disponibles!").',
    importance: 'Evita frustraciones de pedir el color erróneo y genera una urgencia ética de compra.'
  },
  {
    step: '6. Guía de Tallas Interactiva & Recomendador',
    rule: 'Botón visible "📏 ¿Cuál es mi talla?" que abre modal con tabla en cm y recomendador de ajuste por altura/peso.',
    importance: 'Reduce las devoluciones por error de talla en más del 40% en e-commerce de moda.'
  },
  {
    step: '7. Botones CTA de Alta Conversión',
    rule: 'Botón primario ancho "Añadir a la Bolsa" con alto contraste + Botón secundario "Comprar con 1 Clic" + Icono de Favoritos.',
    importance: 'Mobile-first: debe fijarse en la parte inferior en móviles para permitir compra con el pulgar.'
  },
  {
    step: '8. Micro-Copy de Confianza (Trust Pillars)',
    rule: 'Iconos y textos cortos: "🚚 Envíos 24-48h gratis a partir de $49" · "↩️ Cambios y devoluciones gratis en 30 días" · "🔒 Pago seguro".',
    importance: 'Elimina las dudas de última milla justo al lado del botón de compra.'
  },
  {
    step: '9. Acordeón de Descripción & Storytelling',
    rule: 'Estructura en 3 pestañas o acordeones: 1) "Historia & Cómo llevarlo", 2) "Composición & Detalles técnicos", 3) "Cuidados".',
    importance: 'No satura visualmente pero ofrece toda la información a los usuarios más analíticos.'
  },
  {
    step: '10. "Get The Look" / Cross-selling Recomendado',
    rule: 'Carrusel con 2-3 prendas que complementan el outfit de la foto con botón rápido para añadirlas juntas.',
    importance: 'Aumenta el Average Order Value (AOV) de la tienda entre un 15% y un 25%.'
  }
];
