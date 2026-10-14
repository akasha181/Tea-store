const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const products = [
  // Staples
  {
    id: 'staples-sunridge-atta-10kg',
    title: 'Sunridge Chakki Atta',
    urdu: 'سن رج خالص چکی آٹا',
    unit: '10 KG BAG',
    bg1: '#fef3c7',
    bg2: '#d97706',
    accent: '#b45309',
    badge: '100% Whole Wheat',
    category: 'STAPLES & FLOUR',
    iconType: 'sack-wheat'
  },
  {
    id: 'staples-desi-chakki-atta-20kg',
    title: 'Desi Chakki Atta',
    urdu: 'خالص دیسی چکی آٹا',
    unit: '20 KG FAMILY BAG',
    bg1: '#fed7aa',
    bg2: '#c2410c',
    accent: '#9a3412',
    badge: 'Daily Fresh Grind',
    category: 'STAPLES & FLOUR',
    iconType: 'sack-grain'
  },
  {
    id: 'staples-fine-maida-1kg',
    title: 'Fine Maida Super',
    urdu: 'فائن میدہ سپر کوالٹی',
    unit: '1 KG PACK',
    bg1: '#f8fafc',
    bg2: '#94a3b8',
    accent: '#475569',
    badge: 'Super Patent',
    category: 'STAPLES & FLOUR',
    iconType: 'flour-pack'
  },
  {
    id: 'staples-wheat-dalia-1kg',
    title: 'Whole Wheat Dalia',
    urdu: 'خالص چکی گندم دلیہ',
    unit: '1 KG PACK',
    bg1: '#fef9c3',
    bg2: '#ca8a04',
    accent: '#854d0e',
    badge: 'High Fiber',
    category: 'STAPLES & FLOUR',
    iconType: 'dalia-bowl'
  },
  {
    id: 'staples-pure-suji-1kg',
    title: 'Pure Semolina / Suji',
    urdu: 'خالص دیسی سوجی',
    unit: '1 KG PACK',
    bg1: '#fef08a',
    bg2: '#eab308',
    accent: '#a16207',
    badge: 'Crisp Mota Dana',
    category: 'STAPLES & FLOUR',
    iconType: 'suji-bowl'
  },

  // Pulses & Rice
  {
    id: 'pulses-super-basmati-rice-1kg',
    title: 'Super Basmati Rice',
    urdu: 'سپر کائنات باسمتی چاول',
    unit: '1 KG PACK',
    bg1: '#d1fae5',
    bg2: '#059669',
    accent: '#065f46',
    badge: 'Aged 2 Years Kernel',
    category: 'RICE & PULSES',
    iconType: 'rice-bag'
  },
  {
    id: 'pulses-kainat-saila-rice-1kg',
    title: 'Kainat 1121 Sela Rice',
    urdu: 'کائنات 1121 سیلہ چاول',
    unit: '1 KG PACK',
    bg1: '#fef08a',
    bg2: '#10b981',
    accent: '#047857',
    badge: 'Golden Extra Long',
    category: 'RICE & PULSES',
    iconType: 'sela-rice'
  },
  {
    id: 'pulses-daal-chana-special-1kg',
    title: 'Daal Chana Special',
    urdu: 'دال چنا موٹی دیسی',
    unit: '1 KG PACK',
    bg1: '#fef08a',
    bg2: '#eab308',
    accent: '#b45309',
    badge: 'Triple Stone-Free',
    category: 'RICE & PULSES',
    iconType: 'chana-dal'
  },
  {
    id: 'pulses-daal-moong-dhuli-1kg',
    title: 'Daal Moong Washed',
    urdu: 'دال مونگ دھلی ہوئی',
    unit: '1 KG PACK',
    bg1: '#fef9c3',
    bg2: '#84cc16',
    accent: '#4d7c0f',
    badge: 'Quick Cooking',
    category: 'RICE & PULSES',
    iconType: 'moong-dal'
  },
  {
    id: 'pulses-daal-masoor-whole-1kg',
    title: 'Daal Masoor Whole',
    urdu: 'ثابت کالی مسور دال',
    unit: '1 KG PACK',
    bg1: '#ffedd5',
    bg2: '#ea580c',
    accent: '#9a3412',
    badge: 'High Iron & Protein',
    category: 'RICE & PULSES',
    iconType: 'masoor-dal'
  },
  {
    id: 'pulses-daal-mash-washed-1kg',
    title: 'Daal Mash Washed',
    urdu: 'دال ماش دھلی ہوئی',
    unit: '1 KG PACK',
    bg1: '#f1f5f9',
    bg2: '#64748b',
    accent: '#334155',
    badge: 'Special Urad Dal',
    category: 'RICE & PULSES',
    iconType: 'mash-dal'
  },

  // Ghee & Cooking Oil
  {
    id: 'cooking-dalda-banaspati-ghee-1kg',
    title: 'Dalda Banaspati Ghee',
    urdu: 'ڈالڈا بناسپتی گھی',
    unit: '1 KG POUCH',
    bg1: '#fef08a',
    bg2: '#16a34a',
    accent: '#b91c1c',
    badge: 'Vitamin A & D Fortified',
    category: 'GHEE & COOKING OIL',
    iconType: 'ghee-pouch'
  },
  {
    id: 'cooking-habib-oil-canister-5l',
    title: 'Habib Cooking Oil',
    urdu: 'حبیب کوکنگ آئل',
    unit: '5 LITER CANISTER',
    bg1: '#fef08a',
    bg2: '#eab308',
    accent: '#ca8a04',
    badge: 'Naturally Light & Pure',
    category: 'GHEE & COOKING OIL',
    iconType: 'oil-canister'
  },
  {
    id: 'cooking-mehran-desi-sarson-oil-1l',
    title: 'Desi Mustard Oil',
    urdu: 'خالص کوہلو سرسوں کا تیل',
    unit: '1 LITER BOTTLE',
    bg1: '#fef9c3',
    bg2: '#ca8a04',
    accent: '#713f12',
    badge: 'Cold-Pressed Kohlu',
    category: 'GHEE & COOKING OIL',
    iconType: 'mustard-bottle'
  },
  {
    id: 'cooking-sufi-sunflower-oil-1l',
    title: 'Sufi Cooking Oil',
    urdu: 'صوفی کینولا و سن فلاور',
    unit: '1 LITER POUCH',
    bg1: '#fef08a',
    bg2: '#e11d48',
    accent: '#be123c',
    badge: 'Triple Refined',
    category: 'GHEE & COOKING OIL',
    iconType: 'sunflower-oil'
  },

  // Spices & Masalay
  {
    id: 'spices-national-iodized-salt-800g',
    title: 'National Iodized Salt',
    urdu: 'نیشنل آیوڈائزڈ نمک',
    unit: '800 G PACK',
    bg1: '#e0f2fe',
    bg2: '#0284c7',
    accent: '#0369a1',
    badge: 'Vacuum Clean Table Salt',
    category: 'SPICES & SEASONINGS',
    iconType: 'salt-pack'
  },
  {
    id: 'spices-national-red-chilli-200g',
    title: 'National Red Chilli',
    urdu: 'سرخ مرچ پاؤڈر دیسی',
    unit: '200 G PACK',
    bg1: '#fee2e2',
    bg2: '#dc2626',
    accent: '#991b1b',
    badge: 'Pure Sun-Dried Spice',
    category: 'SPICES & SEASONINGS',
    iconType: 'chilli-spice'
  },
  {
    id: 'spices-mehran-turmeric-haldi-200g',
    title: 'Mehran Turmeric Haldi',
    urdu: 'مہران خالص ہلدی پاؤڈر',
    unit: '200 G PACK',
    bg1: '#fef08a',
    bg2: '#eab308',
    accent: '#a16207',
    badge: 'Pure Curcumin Root',
    category: 'SPICES & SEASONINGS',
    iconType: 'haldi-spice'
  },
  {
    id: 'spices-whole-cumin-safaid-zeera-100g',
    title: 'White Cumin / Zeera',
    urdu: 'خالص ثابت سفید زیرہ',
    unit: '100 G PACK',
    bg1: '#fef3c7',
    bg2: '#a16207',
    accent: '#78350f',
    badge: 'High Aromatic Tarka',
    category: 'SPICES & SEASONINGS',
    iconType: 'zeera-spice'
  },

  // Beverages & Dairy
  {
    id: 'beverages-tapal-danedar-tea-430g',
    title: 'Tapal Danedar Tea',
    urdu: 'ٹپال دانے دار چائے',
    unit: '430 G POUCH',
    bg1: '#fee2e2',
    bg2: '#991b1b',
    accent: '#18181b',
    badge: 'Kenyan Granular Blend',
    category: 'TEA, SUGAR & DAIRY',
    iconType: 'tea-pack'
  },
  {
    id: 'beverages-refined-white-sugar-1kg',
    title: 'Refined White Sugar',
    urdu: 'خالص سفید چینی موٹا دانہ',
    unit: '1 KG PACK',
    bg1: '#f0fdf4',
    bg2: '#16a34a',
    accent: '#15803d',
    badge: 'Crystal Pure Sweetness',
    category: 'TEA, SUGAR & DAIRY',
    iconType: 'sugar-bag'
  },
  {
    id: 'beverages-olpers-full-cream-milk-1l',
    title: 'Olpers Full Cream Milk',
    urdu: 'اولپرز فل کریم دودھ',
    unit: '1 LITER TETRA PACK',
    bg1: '#dbeafe',
    bg2: '#2563eb',
    accent: '#1d4ed8',
    badge: '100% UHT Pure Milk',
    category: 'TEA, SUGAR & DAIRY',
    iconType: 'milk-pack'
  }
];

function renderGraphic(type, accent, bg2) {
  switch (type) {
    case 'sack-wheat':
    case 'sack-grain':
      return `
        <!-- Sack Body -->
        <path d="M 230 140 C 230 110, 370 110, 370 140 C 390 190, 400 280, 380 320 C 360 340, 240 340, 220 320 C 200 280, 210 190, 230 140 Z" fill="#d4a373" stroke="#bc6c25" stroke-width="6"/>
        <!-- Sack Tie -->
        <ellipse cx="300" cy="138" rx="45" ry="12" fill="#bc6c25" />
        <path d="M 285 138 Q 300 160 315 138" stroke="#fefae0" stroke-width="4" fill="none"/>
        <!-- Wheat Graphic on Sack -->
        <g transform="translate(280, 190) scale(1.2)">
          <path d="M 15 60 Q 15 10 15 0" stroke="#fefae0" stroke-width="3" fill="none"/>
          <ellipse cx="15" cy="10" rx="6" ry="12" fill="#fefae0"/>
          <ellipse cx="9" cy="22" rx="5" ry="10" fill="#fefae0" transform="rotate(-30 9 22)"/>
          <ellipse cx="21" cy="22" rx="5" ry="10" fill="#fefae0" transform="rotate(30 21 22)"/>
          <ellipse cx="8" cy="36" rx="5" ry="10" fill="#fefae0" transform="rotate(-30 8 36)"/>
          <ellipse cx="22" cy="36" rx="5" ry="10" fill="#fefae0" transform="rotate(30 22 36)"/>
        </g>
        <!-- Stamp Label -->
        <rect x="250" y="270" width="100" height="28" rx="6" fill="#7f4f24" opacity="0.9"/>
        <text x="300" y="289" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold" font-family="sans-serif">CHAKKI FRESH</text>
      `;

    case 'flour-pack':
      return `
        <!-- White Flour Bag -->
        <rect x="235" y="130" width="130" height="190" rx="16" fill="#f8fafc" stroke="#94a3b8" stroke-width="6"/>
        <rect x="245" y="140" width="110" height="40" rx="8" fill="#e2e8f0"/>
        <text x="300" y="165" text-anchor="middle" fill="#334155" font-size="14" font-weight="900" font-family="sans-serif">FINE MAIDA</text>
        <circle cx="300" cy="225" r="32" fill="#cbd5e1" opacity="0.5"/>
        <path d="M 285 225 Q 300 205 315 225 Q 300 245 285 225 Z" fill="#ffffff"/>
        <!-- Weight Tag -->
        <rect x="260" y="275" width="80" height="26" rx="13" fill="#0284c7"/>
        <text x="300" y="292" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold" font-family="sans-serif">100% PURE</text>
      `;

    case 'dalia-bowl':
    case 'suji-bowl':
      return `
        <!-- Bowl -->
        <ellipse cx="300" cy="280" rx="90" ry="30" fill="#ca8a04" opacity="0.3"/>
        <path d="M 210 220 Q 210 300 300 300 Q 390 300 390 220 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="6"/>
        <!-- Porridge Grains in Bowl -->
        <ellipse cx="300" cy="220" rx="90" ry="24" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
        <circle cx="280" cy="218" r="4" fill="#a16207"/>
        <circle cx="310" cy="222" r="5" fill="#a16207"/>
        <circle cx="330" cy="216" r="4" fill="#a16207"/>
        <circle cx="260" cy="220" r="4" fill="#a16207"/>
        <!-- Wooden Spoon -->
        <path d="M 330 190 Q 370 140 380 120" stroke="#b45309" stroke-width="12" stroke-linecap="round"/>
        <ellipse cx="330" cy="195" rx="16" ry="10" fill="#9a3412" transform="rotate(-20 330 195)"/>
      `;

    case 'rice-bag':
    case 'sela-rice':
      return `
        <!-- Rice Sacks -->
        <path d="M 230 135 C 240 120, 360 120, 370 135 C 385 180, 395 270, 380 320 C 360 335, 240 335, 220 320 C 205 270, 215 180, 230 135 Z" fill="#fdfbf7" stroke="#059669" stroke-width="6"/>
        <!-- Golden Decorative Rice Seal -->
        <circle cx="300" cy="215" r="42" fill="#ecfdf5" stroke="#10b981" stroke-width="3"/>
        <path d="M 290 200 Q 300 180 310 200 Q 320 220 300 235 Q 280 220 290 200 Z" fill="#059669"/>
        <text x="300" y="270" text-anchor="middle" fill="#065f46" font-size="13" font-weight="900" font-family="sans-serif">KAINAT 1121</text>
        <rect x="250" y="285" width="100" height="22" rx="4" fill="#059669"/>
        <text x="300" y="300" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="bold" font-family="sans-serif">AGED BASMATI</text>
      `;

    case 'chana-dal':
    case 'moong-dal':
    case 'masoor-dal':
    case 'mash-dal':
      return `
        <!-- Dal Bowl & Pouch -->
        <path d="M 240 130 L 360 130 L 375 310 L 225 310 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="6"/>
        <rect x="250" y="145" width="100" height="35" rx="6" fill="${accent}"/>
        <text x="300" y="167" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold" font-family="sans-serif">DAAL SPECIAL</text>
        <!-- Window with Dal Grains -->
        <ellipse cx="300" cy="235" rx="48" ry="40" fill="${bg2}" stroke="#fef08a" stroke-width="4"/>
        <circle cx="285" cy="225" r="5" fill="#ffffff" opacity="0.8"/>
        <circle cx="310" cy="230" r="6" fill="#ffffff" opacity="0.8"/>
        <circle cx="295" cy="245" r="5" fill="#ffffff" opacity="0.8"/>
        <circle cx="320" cy="240" r="4" fill="#ffffff" opacity="0.8"/>
        <text x="300" y="298" text-anchor="middle" fill="#334155" font-size="11" font-weight="800" font-family="sans-serif">100% CLEANED</text>
      `;

    case 'ghee-pouch':
      return `
        <!-- Dalda Ghee Pouch Structure -->
        <path d="M 240 120 L 360 120 L 380 320 L 220 320 Z" fill="#15803d" stroke="#166534" stroke-width="6"/>
        <!-- Red Top Diagonal Ribbon -->
        <path d="M 240 120 L 360 120 L 365 170 L 235 170 Z" fill="#dc2626"/>
        <text x="300" y="152" text-anchor="middle" fill="#ffffff" font-size="18" font-weight="900" font-family="sans-serif">DALDA</text>
        <!-- Yellow Sunlight & Droplet -->
        <circle cx="300" cy="230" r="38" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
        <path d="M 300 205 C 315 225, 320 245, 300 255 C 280 245, 285 225, 300 205 Z" fill="#eab308"/>
        <text x="300" y="295" text-anchor="middle" fill="#fef08a" font-size="13" font-weight="bold" font-family="sans-serif">BANASPATI GHEE</text>
      `;

    case 'oil-canister':
      return `
        <!-- Oil Canister 5L -->
        <rect x="230" y="140" width="140" height="175" rx="16" fill="#fef08a" stroke="#ca8a04" stroke-width="6"/>
        <!-- Handle -->
        <path d="M 240 140 C 240 100, 290 100, 290 140" stroke="#ca8a04" stroke-width="12" fill="none" stroke-linecap="round"/>
        <!-- Red Cap -->
        <rect x="325" y="125" width="25" height="18" rx="4" fill="#dc2626"/>
        <!-- Label -->
        <rect x="245" y="175" width="110" height="90" rx="10" fill="#ffffff" stroke="#eab308" stroke-width="3"/>
        <circle cx="300" cy="205" r="18" fill="#facc15"/>
        <path d="M 300 195 C 308 207, 310 216, 300 220 C 290 216, 292 207, 300 195 Z" fill="#ca8a04"/>
        <text x="300" y="242" text-anchor="middle" fill="#15803d" font-size="14" font-weight="900" font-family="sans-serif">HABIB OIL</text>
        <text x="300" y="256" text-anchor="middle" fill="#64748b" font-size="9" font-weight="bold" font-family="sans-serif">CHOLESTEROL FREE</text>
      `;

    case 'mustard-bottle':
    case 'sunflower-oil':
      return `
        <!-- Transparent Bottle with Golden Oil -->
        <rect x="255" y="145" width="90" height="170" rx="18" fill="#fef08a" stroke="#ca8a04" stroke-width="6"/>
        <!-- Bottle Neck & Cap -->
        <rect x="280" y="115" width="40" height="32" rx="4" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
        <rect x="277" y="105" width="46" height="14" rx="3" fill="#eab308"/>
        <!-- Sarson Flowers on Label -->
        <rect x="262" y="185" width="76" height="70" rx="8" fill="#713f12"/>
        <circle cx="300" cy="210" r="14" fill="#fef08a"/>
        <circle cx="292" cy="204" r="5" fill="#f59e0b"/>
        <circle cx="308" cy="204" r="5" fill="#f59e0b"/>
        <circle cx="300" cy="218" r="5" fill="#f59e0b"/>
        <text x="300" y="243" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="bold" font-family="sans-serif">PURE MUSTARD</text>
      `;

    case 'salt-pack':
      return `
        <!-- Salt Pouch -->
        <rect x="240" y="130" width="120" height="185" rx="16" fill="#0284c7" stroke="#0369a1" stroke-width="6"/>
        <rect x="240" y="130" width="120" height="40" rx="16" fill="#0369a1"/>
        <text x="300" y="157" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="900" font-family="sans-serif">NATIONAL</text>
        <circle cx="300" cy="225" r="36" fill="#ffffff"/>
        <!-- Salt Crystals Flowing -->
        <path d="M 285 235 L 300 205 L 315 235 Z" fill="#0284c7"/>
        <text x="300" y="285" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold" font-family="sans-serif">IODIZED SALT</text>
      `;

    case 'chilli-spice':
    case 'haldi-spice':
    case 'zeera-spice':
      return `
        <!-- Spice Pouch with Vibrant Powder -->
        <rect x="240" y="130" width="120" height="185" rx="16" fill="#ffffff" stroke="${accent}" stroke-width="6"/>
        <!-- Top Banner -->
        <rect x="243" y="133" width="114" height="42" rx="12" fill="${accent}"/>
        <text x="300" y="160" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="900" font-family="sans-serif">NATIONAL</text>
        <!-- Center Spice Window -->
        <circle cx="300" cy="225" r="38" fill="${bg2}" stroke="#fef08a" stroke-width="3"/>
        <path d="M 275 235 Q 300 200 325 235 Z" fill="#ffffff" opacity="0.3"/>
        <text x="300" y="290" text-anchor="middle" fill="${accent}" font-size="12" font-weight="900" font-family="sans-serif">PURE SPICE</text>
      `;

    case 'tea-pack':
      return `
        <!-- Tapal Danedar Signature Red & Black Pack -->
        <rect x="235" y="130" width="130" height="190" rx="14" fill="#dc2626" stroke="#991b1b" stroke-width="6"/>
        <!-- Black Diagonal Band -->
        <path d="M 235 180 L 365 150 L 365 240 L 235 270 Z" fill="#18181b"/>
        <text x="300" y="210" text-anchor="middle" fill="#ffffff" font-size="18" font-weight="900" font-family="sans-serif">TAPAL</text>
        <text x="300" y="230" text-anchor="middle" fill="#facc15" font-size="12" font-weight="bold" font-family="sans-serif">DANEDAR</text>
        <!-- Tea Cup Icon -->
        <path d="M 285 285 Q 285 305 300 305 Q 315 305 315 285 Z" fill="#ffffff"/>
        <path d="M 297 280 Q 300 270 303 280" stroke="#fef08a" stroke-width="2" fill="none"/>
      `;

    case 'sugar-bag':
      return `
        <!-- Refined Sugar Bag -->
        <rect x="235" y="130" width="130" height="190" rx="16" fill="#f0fdf4" stroke="#16a34a" stroke-width="6"/>
        <rect x="245" y="145" width="110" height="35" rx="8" fill="#16a34a"/>
        <text x="300" y="168" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="bold" font-family="sans-serif">WHITE SUGAR</text>
        <!-- Sugar Crystals Visual -->
        <circle cx="300" cy="225" r="34" fill="#dcfce7"/>
        <polygon points="300,205 315,225 300,245 285,225" fill="#16a34a"/>
        <text x="300" y="290" text-anchor="middle" fill="#15803d" font-size="12" font-weight="bold" font-family="sans-serif">خالص سفید چینی</text>
      `;

    case 'milk-pack':
      return `
        <!-- Olpers Tetra Milk Pack -->
        <polygon points="255,130 300,105 345,130 345,310 255,310" fill="#2563eb" stroke="#1d4ed8" stroke-width="6"/>
        <polygon points="255,130 300,105 345,130" fill="#1e40af"/>
        <text x="300" y="175" text-anchor="middle" fill="#ffffff" font-size="18" font-weight="900" font-family="sans-serif">Olpers</text>
        <!-- Milk Splash Curve -->
        <path d="M 260 230 Q 300 260 340 230 L 340 305 L 260 305 Z" fill="#ffffff"/>
        <text x="300" y="280" text-anchor="middle" fill="#1e40af" font-size="11" font-weight="bold" font-family="sans-serif">FULL CREAM</text>
      `;

    default:
      return `
        <circle cx="300" cy="225" r="50" fill="${accent}"/>
      `;
  }
}

for (const p of products) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.bg1}" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.12"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="600" height="400" fill="url(#bgGrad)" />

  <!-- Soft Accent Ambient Glow -->
  <circle cx="300" cy="220" r="160" fill="${p.bg2}" opacity="0.12" />

  <!-- Outer Elegant Frame -->
  <rect x="18" y="18" width="564" height="364" rx="24" fill="none" stroke="${p.accent}" stroke-width="2" stroke-opacity="0.25"/>

  <!-- Store Header Strip -->
  <rect x="36" y="28" width="528" height="34" rx="10" fill="#0f291e" opacity="0.9"/>
  <text x="50" y="50" fill="#a3e635" font-size="11" font-weight="900" font-family="system-ui, sans-serif" letter-spacing="1">HAFIZ G CHAI &amp; KIRYANA STORE</text>
  <text x="548" y="50" text-anchor="end" fill="#ffffff" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">${p.category}</text>

  <!-- Product Illustration -->
  <g filter="url(#cardShadow)">
    ${renderGraphic(p.iconType, p.accent, p.bg2)}
  </g>

  <!-- Left Side Badge: Guarantee -->
  <g transform="translate(36, 120)">
    <rect width="130" height="48" rx="12" fill="#ffffff" stroke="${p.accent}" stroke-width="1.5" filter="url(#cardShadow)"/>
    <text x="65" y="22" text-anchor="middle" fill="#64748b" font-size="9" font-weight="bold" font-family="system-ui, sans-serif">QUALITY SEAL</text>
    <text x="65" y="38" text-anchor="middle" fill="${p.accent}" font-size="11" font-weight="900" font-family="system-ui, sans-serif">100% KHÁLIS</text>
  </g>

  <!-- Right Side Badge: Unit Weight -->
  <g transform="translate(434, 120)">
    <rect width="130" height="48" rx="12" fill="#ffffff" stroke="${p.accent}" stroke-width="1.5" filter="url(#cardShadow)"/>
    <text x="65" y="22" text-anchor="middle" fill="#64748b" font-size="9" font-weight="bold" font-family="system-ui, sans-serif">NET WEIGHT</text>
    <text x="65" y="38" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="900" font-family="system-ui, sans-serif">${p.unit}</text>
  </g>

  <!-- Bottom Details Overlay Banner -->
  <g transform="translate(36, 326)">
    <rect width="528" height="48" rx="14" fill="#0f291e" filter="url(#cardShadow)"/>
    <!-- English Name -->
    <text x="24" y="30" fill="#ffffff" font-size="16" font-weight="900" font-family="system-ui, sans-serif">${p.title}</text>
    <!-- Badge -->
    <rect x="260" y="14" width="130" height="22" rx="6" fill="#a3e635"/>
    <text x="325" y="29" text-anchor="middle" fill="#052e16" font-size="10" font-weight="900" font-family="system-ui, sans-serif">${p.badge}</text>
    <!-- Urdu Name -->
    <text x="508" y="31" text-anchor="end" fill="#fef08a" font-size="16" font-weight="bold" font-family="system-ui, 'Noto Nastaliq Urdu', sans-serif">${p.urdu}</text>
  </g>
</svg>`;

  const filePath = path.join(outDir, `${p.id}.svg`);
  fs.writeFileSync(filePath, svg, 'utf8');
}

console.log(`Successfully generated ${products.length} product dummy SVG pictures in ${outDir}`);
