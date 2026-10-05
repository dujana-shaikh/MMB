import { Product, CustomerOrder } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // PHOTOGRAPHY
  {
    id: 'prod-cam-01',
    name: 'MMB Pro CyberShot 4K Mirrorless Camera',
    category: 'PHOTOGRAPHY',
    price: 54990.0,
    originalPrice: 62990.0,
    stock: 14,
    reorderLevel: 5,
    sku: 'MMB-CAM-4K8',
    rating: 4.9,
    reviewsCount: 142,
    image: '/src/assets/images/hero_cyan_camera_1791176277434.jpg',
    description: 'High-performance 32.5MP full-frame mirrorless digital camera with 4K UHD video recording, optical stabilization, and dual pixel autofocus.',
    isFeatured: true,
    brand: 'Sony',
    variants: [
      { id: 'cam-v1', name: 'Body Only', price: 54990.0, originalPrice: 62990.0 },
      { id: 'cam-v2', name: '18-55mm Kit Lens', price: 58990.0, originalPrice: 67990.0 },
      { id: 'cam-v3', name: 'Creator Video Bundle', price: 69990.0, originalPrice: 79990.0 }
    ],
    subVariants: ['Matte Black', 'Silver Chrome', 'Titanium Gray'],
    customerContact: {
      name: 'Marcus Vance',
      phone: '+91 98201 23456',
      email: 'm.vance@example.com',
      city: 'Bandra West, Mumbai',
      lastInquiry: 'Looking for 18-55mm lens package'
    },
    specifications: {
      Sensor: '32.5 MP Full-Frame CMOS',
      Video: '4K UHD 60fps / 10-bit',
      Screen: '3.0-inch Tilt Touchscreen',
      Connectivity: 'Wi-Fi 6, Bluetooth 5.2, USB-C'
    },
    createdAt: '2026-09-15T10:00:00Z'
  },

  // CELL PHONES
  {
    id: 'prod-phn-01',
    name: 'iPhone 16 Pro Max 5G (Natural Titanium)',
    category: 'CELL PHONES',
    price: 124900.0,
    originalPrice: 134900.0,
    stock: 16,
    reorderLevel: 4,
    sku: 'MMB-APL-16PM',
    rating: 4.9,
    reviewsCount: 480,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80',
    description: 'A18 Pro chip, 48MP Fusion camera system with 5x Telephoto zoom, Grade 5 titanium frame, and all-day battery life.',
    isFeatured: true,
    brand: 'Apple',
    variants: [
      { id: 'phn1-v1', name: '128GB', price: 124900.0, originalPrice: 134900.0 },
      { id: 'phn1-v2', name: '256GB', price: 134900.0, originalPrice: 144900.0 },
      { id: 'phn1-v3', name: '512GB', price: 154900.0, originalPrice: 164900.0 },
      { id: 'phn1-v4', name: '1TB', price: 174900.0, originalPrice: 184900.0 }
    ],
    subVariants: ['Natural Titanium', 'Desert Titanium', 'Black Titanium', 'White Titanium'],
    customerContact: {
      name: 'Elena Rostova',
      phone: '+91 97690 12345',
      email: 'elena.rostova@designlab.net',
      city: 'Andheri East, Mumbai',
      lastInquiry: 'Inquired for Natural Titanium 256GB'
    },
    specifications: {
      Display: '6.9" Super Retina XDR OLED ProMotion',
      Chip: 'A18 Pro 3nm Silicon',
      Camera: '48MP Main + 48MP Ultra + 12MP 5x Tele'
    },
    createdAt: '2026-09-20T12:00:00Z'
  },
  {
    id: 'prod-phn-02',
    name: 'Samsung Galaxy S24 Ultra 5G AI Phone',
    category: 'CELL PHONES',
    price: 109999.0,
    originalPrice: 124999.0,
    stock: 12,
    reorderLevel: 4,
    sku: 'MMB-SAM-S24U',
    rating: 4.8,
    reviewsCount: 390,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80',
    description: 'Galaxy AI powered 200MP camera phone with embedded S Pen stylus, Snapdragon 8 Gen 3, and flat Armor Aluminum display.',
    isFeatured: true,
    brand: 'Samsung',
    variants: [
      { id: 'phn2-v1', name: '256GB', price: 109999.0, originalPrice: 124999.0 },
      { id: 'phn2-v2', name: '512GB', price: 119999.0, originalPrice: 134999.0 },
      { id: 'phn2-v3', name: '1TB', price: 139999.0, originalPrice: 154999.0 }
    ],
    subVariants: ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow'],
    customerContact: {
      name: 'Rajesh Verma',
      phone: '+91 98201 88412',
      email: 'rajesh.verma@fintech.in',
      city: 'Bandra West, Mumbai',
      lastInquiry: 'Negotiating trade-in on S24 Ultra 512GB'
    },
    specifications: {
      Display: '6.8" QHD+ Dynamic AMOLED 2X 120Hz',
      Camera: '200MP Quad Tele System',
      Battery: '5000mAh with 45W Fast Charging'
    },
    createdAt: '2026-09-18T14:30:00Z'
  },
  {
    id: 'prod-phn-03',
    name: 'Google Pixel 9 Pro 5G with Gemini AI',
    category: 'CELL PHONES',
    price: 79999.0,
    originalPrice: 89999.0,
    stock: 9,
    reorderLevel: 3,
    sku: 'MMB-GGL-PX9P',
    rating: 4.7,
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
    description: 'Google Tensor G4 with Gemini AI intelligence, best-in-class computational photography, and Super Actua display.',
    brand: 'Google Pixel',
    variants: [
      { id: 'phn3-v1', name: '128GB', price: 79999.0, originalPrice: 89999.0 },
      { id: 'phn3-v2', name: '256GB', price: 84999.0, originalPrice: 99999.0 },
      { id: 'phn3-v3', name: '512GB', price: 99999.0, originalPrice: 114999.0 }
    ],
    subVariants: ['Obsidian Black', 'Porcelain White', 'Hazel Green', 'Rose Quartz'],
    customerContact: {
      name: 'Ananya Sharma',
      phone: '+91 98332 45671',
      email: 'ananya.s@studio.in',
      city: 'Juhu, Mumbai',
      lastInquiry: 'Needs Hazel Green 256GB'
    },
    specifications: {
      Display: '6.3" Super Actua OLED (1-120Hz)',
      Chip: 'Google Tensor G4 with Titan M2',
      Camera: '50MP + 48MP Quad PD'
    },
    createdAt: '2026-09-22T09:15:00Z'
  },
  {
    id: 'prod-phn-04',
    name: 'OnePlus 12 5G Hasselblad Flagship',
    category: 'CELL PHONES',
    price: 54999.0,
    originalPrice: 64999.0,
    stock: 15,
    reorderLevel: 4,
    sku: 'MMB-1PL-12',
    rating: 4.8,
    reviewsCount: 290,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    description: 'Snapdragon 8 Gen 3 with 4th Gen Hasselblad Camera, 5400mAh battery with 100W SUPERVOOC and 50W AIRVOOC fast charging.',
    brand: 'OnePlus',
    variants: [
      { id: 'phn4-v1', name: '12GB + 256GB', price: 54999.0, originalPrice: 64999.0 },
      { id: 'phn4-v2', name: '16GB + 512GB', price: 59999.0, originalPrice: 69999.0 }
    ],
    subVariants: ['Flowy Emerald', 'Silky Black', 'Glacial White'],
    customerContact: {
      name: 'Vikram Joshi',
      phone: '+91 99200 44551',
      email: 'vikram.j@techmumbai.com',
      city: 'Powai, Mumbai',
      lastInquiry: 'Wholesale inquiry for 5 units'
    },
    specifications: {
      Display: '6.82" 2K 120Hz ProXDR LTPO',
      Processor: 'Snapdragon 8 Gen 3',
      Camera: '50MP Sony LYT-808 + 64MP 3x Periscope'
    },
    createdAt: '2026-09-25T11:00:00Z'
  },
  {
    id: 'prod-phn-05',
    name: 'Xiaomi 14 Ultra 5G Leica 1-inch Optics',
    category: 'CELL PHONES',
    price: 89999.0,
    originalPrice: 99999.0,
    stock: 8,
    reorderLevel: 3,
    sku: 'MMB-XIA-14U',
    rating: 4.9,
    reviewsCount: 175,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    description: 'Leica Quad Camera with 1-inch LYT-900 sensor and stepless variable aperture f/1.63-f/4.0, Snapdragon 8 Gen 3, and ultra-durable Guardian Structure.',
    brand: 'Xiaomi',
    variants: [
      { id: 'phn5-v1', name: '16GB + 512GB', price: 89999.0, originalPrice: 99999.0 }
    ],
    subVariants: ['Nano-Tech Vegan Leather Black', 'White Ceramic'],
    customerContact: {
      name: 'Aditya Mehta',
      phone: '+91 98198 33221',
      email: 'aditya.m@corp.in',
      city: 'Colaba, Mumbai',
      lastInquiry: 'Requested photography kit accessory'
    },
    specifications: {
      Display: '6.73" WQHD+ 120Hz AMOLED 3000 nits',
      Camera: 'Quad 50MP Leica All-Star Sensors',
      Charging: '90W HyperCharge + 80W Wireless'
    },
    createdAt: '2026-09-26T14:30:00Z'
  },

  // HEADPHONES
  {
    id: 'prod-hp-01',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    category: 'HEADPHONES',
    price: 26990.0,
    originalPrice: 32990.0,
    stock: 18,
    reorderLevel: 5,
    sku: 'MMB-SNY-XM5',
    rating: 4.9,
    reviewsCount: 520,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Industry-leading noise cancellation with 8 microphones, Auto NC Optimizer, carbon fiber 30mm drivers, and 30-hour battery life.',
    isFeatured: true,
    brand: 'Sony',
    variants: [
      { id: 'hp1-v1', name: 'Standard ANC', price: 26990.0, originalPrice: 32990.0 },
      { id: 'hp1-v2', name: 'Studio Hardcase Bundle', price: 29990.0, originalPrice: 34990.0 }
    ],
    subVariants: ['Midnight Black', 'Platinum Silver', 'Smoky Pink'],
    customerContact: {
      name: 'Sophia Chen',
      phone: '+91 98192 34567',
      email: 'sophia.chen@example.com',
      city: 'Nariman Point, Mumbai',
      lastInquiry: 'Confirmed order status check'
    },
    specifications: {
      ANC: 'Dual Processor V1 + HD QN1',
      Battery: '30h Playback with Quick Charge',
      Codec: 'LDAC, DSEE Extreme, Hi-Res Wireless'
    },
    createdAt: '2026-09-10T14:10:00Z'
  },
  {
    id: 'prod-hp-02',
    name: 'Apple AirPods Max Spatial Audio',
    category: 'HEADPHONES',
    price: 46990.0,
    originalPrice: 54900.0,
    stock: 8,
    reorderLevel: 3,
    sku: 'MMB-APL-MAX',
    rating: 4.8,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    description: 'High-fidelity audio with active noise cancellation, transparency mode, personalized spatial audio with dynamic head tracking.',
    isFeatured: true,
    brand: 'Apple',
    variants: [
      { id: 'hp2-v1', name: 'Lightning Edition', price: 46990.0, originalPrice: 54900.0 },
      { id: 'hp2-v2', name: 'USB-C Lossless Edition', price: 49990.0, originalPrice: 59900.0 }
    ],
    subVariants: ['Space Gray', 'Silver', 'Sky Blue', 'Starlight', 'Midnight'],
    customerContact: {
      name: 'Kavita Singhal',
      phone: '+91 98210 99882',
      email: 'kavita@musicart.in',
      city: 'Worli, Mumbai',
      lastInquiry: 'Asked for USB-C Space Gray'
    },
    specifications: {
      Drivers: 'Apple-designed 40mm Dynamic Driver',
      Chip: 'Apple H1 Headphone Chip (each ear cup)',
      Battery: '20h Listening with ANC Enabled'
    },
    createdAt: '2026-09-12T10:00:00Z'
  },
  {
    id: 'prod-hp-03',
    name: 'Bose QuietComfort 45 Premium Wireless Headset',
    category: 'HEADPHONES',
    price: 21990.0,
    originalPrice: 26990.0,
    stock: 14,
    reorderLevel: 4,
    sku: 'MMB-BSE-QC45',
    rating: 4.7,
    reviewsCount: 260,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
    description: 'Legendary acoustic noise cancelling technology, quiet and aware modes, plush synthetic leather ear cushions, and 22-hour battery.',
    brand: 'Bose',
    variants: [
      { id: 'hp3-v1', name: 'QC45 Classic', price: 21990.0, originalPrice: 26990.0 },
      { id: 'hp3-v2', name: 'QC Ultra Edition', price: 24990.0, originalPrice: 29990.0 }
    ],
    subVariants: ['Triple Black', 'White Smoke', 'Cypress Green'],
    customerContact: {
      name: 'Priya Desai',
      phone: '+91 98670 33214',
      email: 'priya.d@bosefan.in',
      city: 'Santacruz, Mumbai',
      lastInquiry: 'Checked warranty terms'
    },
    specifications: {
      Weight: '240g Ultra Lightweight',
      Connectivity: 'Bluetooth 5.1 Multi-point',
      Battery: '24h with USB-C Fast Charge'
    },
    createdAt: '2026-09-14T11:45:00Z'
  },
  {
    id: 'prod-hp-04',
    name: 'Samsung Galaxy Buds3 Pro True Wireless ANC Earbuds',
    category: 'HEADPHONES',
    price: 12999.0,
    originalPrice: 17999.0,
    stock: 22,
    reorderLevel: 6,
    sku: 'MMB-SAM-B3P',
    rating: 4.6,
    reviewsCount: 195,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    description: 'Blade design with Blade Lights, Hi-Fi 24-bit audio, adaptive noise control with voice detect, and 360 Audio with direct multi-channel.',
    brand: 'Samsung',
    variants: [
      { id: 'hp4-v1', name: 'Buds3 Pro Earbuds', price: 12999.0, originalPrice: 17999.0 },
      { id: 'hp4-v2', name: 'Buds3 Pro + Wireless Duo Pad', price: 14999.0, originalPrice: 19999.0 }
    ],
    subVariants: ['Blade Silver', 'Phantom White'],
    customerContact: {
      name: 'Rohan Mehra',
      phone: '+91 97699 88123',
      email: 'rohan.mehra@audiotech.in',
      city: 'Thane West, Mumbai',
      lastInquiry: 'Ready for pickup at Dadar branch'
    },
    specifications: {
      Audio: '2-way Woofer & Planar Tweeter',
      Battery: 'Up to 30 Hours with Case',
      Rating: 'IP57 Water & Sweat Resistant'
    },
    createdAt: '2026-09-16T16:20:00Z'
  },

  // TABLETS
  {
    id: 'prod-tab-01',
    name: 'iPad Pro 13-inch M4 Ultra Retina OLED Display',
    category: 'TABLETS',
    price: 109900.0,
    originalPrice: 119900.0,
    stock: 11,
    reorderLevel: 4,
    sku: 'MMB-APL-IP13',
    rating: 4.9,
    reviewsCount: 230,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
    description: 'Thinnovation design at 5.1mm, tandem OLED Ultra Retina XDR display, breakthrough Apple M4 chip with 38 TOPS Neural Engine.',
    isFeatured: true,
    brand: 'Apple',
    variants: [
      { id: 'tab1-v1', name: '256GB Wi-Fi', price: 109900.0, originalPrice: 119900.0 },
      { id: 'tab1-v2', name: '512GB Wi-Fi', price: 119900.0, originalPrice: 129900.0 },
      { id: 'tab1-v3', name: '1TB Wi-Fi + 5G Cellular', price: 149900.0, originalPrice: 169900.0 }
    ],
    subVariants: ['Space Black', 'Silver'],
    customerContact: {
      name: 'David K. Miller',
      phone: '+91 99304 56789',
      email: 'd.miller@techflow.io',
      city: 'Powai, Mumbai',
      lastInquiry: 'Verified corporate GST billing'
    },
    specifications: {
      Display: '13" Tandem OLED Ultra Retina XDR',
      Chip: 'Apple M4 10-core GPU',
      Thickness: '5.1mm Ultra Thin Titanium'
    },
    createdAt: '2026-09-14T09:40:00Z'
  },
  {
    id: 'prod-tab-02',
    name: 'Samsung Galaxy Tab S9 Ultra 14.6" Dynamic AMOLED 2X',
    category: 'TABLETS',
    price: 79999.0,
    originalPrice: 89999.0,
    stock: 7,
    reorderLevel: 3,
    sku: 'MMB-SAM-TS9U',
    rating: 4.8,
    reviewsCount: 145,
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=600&q=80',
    description: 'Giant 14.6-inch 120Hz display with included IP68 S Pen, Snapdragon 8 Gen 2 for Galaxy, and quad AKG tuned speakers.',
    brand: 'Samsung',
    variants: [
      { id: 'tab2-v1', name: '256GB Wi-Fi', price: 79999.0, originalPrice: 89999.0 },
      { id: 'tab2-v2', name: '512GB 5G + S-Pen', price: 84999.0, originalPrice: 94999.0 }
    ],
    subVariants: ['Graphite', 'Beige'],
    customerContact: {
      name: 'Amit Singhania',
      phone: '+91 98205 11223',
      email: 'amit.s@singhania.com',
      city: 'Malabar Hill, Mumbai',
      lastInquiry: 'Interested in keyboard folio bundle'
    },
    specifications: {
      Display: '14.6" Dynamic AMOLED 2X (2960x1848)',
      Waterproof: 'IP68 Tablet & S Pen',
      Battery: '11,200mAh Huge Capacity'
    },
    createdAt: '2026-09-15T15:00:00Z'
  },
  {
    id: 'prod-tab-03',
    name: 'Xiaomi Pad 6 Max 12.4" 120Hz Quad Speaker Tablet',
    category: 'TABLETS',
    price: 29999.0,
    originalPrice: 34999.0,
    stock: 14,
    reorderLevel: 5,
    sku: 'MMB-XIA-P6M',
    rating: 4.6,
    reviewsCount: 180,
    image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=600&q=80',
    description: 'High performance 2.8K 120Hz gaming tablet with 67W turbo charging, 8-speaker surround sound, and metal unibody enclosure.',
    brand: 'Xiaomi',
    variants: [
      { id: 'tab3-v1', name: '8GB + 256GB', price: 29999.0, originalPrice: 34999.0 },
      { id: 'tab3-v2', name: '12GB + 512GB', price: 32999.0, originalPrice: 37999.0 }
    ],
    subVariants: ['Dark Gray', 'Silver Metallic'],
    customerContact: {
      name: 'Karan Patel',
      phone: '+91 98190 77654',
      email: 'karan.p@finadvisory.in',
      city: 'Dadar, Mumbai',
      lastInquiry: 'Requested stylus compatibility demo'
    },
    specifications: {
      Display: '12.4" 2.8K 120Hz 500 nits',
      Processor: 'Snapdragon 8+ Gen 1',
      Charging: '67W Turbo Charge (10000mAh)'
    },
    createdAt: '2026-09-17T08:30:00Z'
  }
];

export const INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: 'ORD-2026-8841',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@example.com',
    customerPhone: '+91 98201 23456',
    items: [
      {
        productId: 'prod-cam-01',
        name: 'MMB Pro CyberShot 4K Mirrorless Camera',
        price: 58990.0,
        quantity: 1,
        category: 'PHOTOGRAPHY'
      }
    ],
    totalAmount: 58990.0,
    discountAmount: 0,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    createdAt: '2026-10-04T19:30:00Z',
    shippingAddress: 'Flat 402, Sea Green Apts, Bandra West, Mumbai, MH 400050',
    paymentMethod: 'UPI (Google Pay)',
    trackingNumber: 'TRK-9041285'
  },
  {
    id: 'ORD-2026-8840',
    customerName: 'Sophia Chen',
    customerEmail: 'sophia.chen@example.com',
    customerPhone: '+91 98192 34567',
    items: [
      {
        productId: 'prod-hp-01',
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        price: 29990.0,
        quantity: 1,
        category: 'HEADPHONES'
      }
    ],
    totalAmount: 29990.0,
    discountAmount: 0,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    createdAt: '2026-10-04T18:15:00Z',
    shippingAddress: '14B Maker Chambers, Nariman Point, Mumbai, MH 400021',
    paymentMethod: 'Credit Card (HDFC)',
    trackingNumber: 'TRK-8812903'
  },
  {
    id: 'ORD-2026-8839',
    customerName: 'David K. Miller',
    customerEmail: 'd.miller@techflow.io',
    customerPhone: '+91 99304 56789',
    items: [
      {
        productId: 'prod-tab-01',
        name: 'iPad Pro 13-inch M4 Ultra Retina OLED Display (256GB)',
        price: 119900.0,
        quantity: 1,
        category: 'TABLETS'
      }
    ],
    totalAmount: 119900.0,
    discountAmount: 0,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    createdAt: '2026-10-03T14:40:00Z',
    shippingAddress: '701 Hiranandani Gardens, Powai, Mumbai, MH 400076',
    paymentMethod: 'UPI (PhonePe)',
    trackingNumber: 'TRK-7719230'
  },
  {
    id: 'ORD-2026-8838',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@designlab.net',
    customerPhone: '+91 97690 12345',
    items: [
      {
        productId: 'prod-phn-01',
        name: 'iPhone 16 Pro Max 5G (256GB - Natural Titanium)',
        price: 134900.0,
        quantity: 1,
        category: 'CELL PHONES'
      }
    ],
    totalAmount: 134900.0,
    discountAmount: 0,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    createdAt: '2026-10-02T11:05:00Z',
    shippingAddress: 'B-304 Oberoi Splendor, Andheri East, Mumbai, MH 400069',
    paymentMethod: 'Net Banking (ICICI)',
    trackingNumber: 'TRK-6629104'
  }
];

export const HOURLY_SALES_DATA = [
  { time: '08:00', sales: 48000, orders: 3 },
  { time: '10:00', sales: 112000, orders: 6 },
  { time: '12:00', sales: 189000, orders: 9 },
  { time: '14:00', sales: 245000, orders: 12 },
  { time: '16:00', sales: 310000, orders: 15 },
  { time: '18:00', sales: 428000, orders: 19 },
  { time: '20:00', sales: 395000, orders: 17 },
  { time: '22:00', sales: 215000, orders: 8 }
];

export const CATEGORY_QUICK_PICKS = [
  {
    id: 'HEADPHONES',
    label: 'Headphone',
    sublabel: 'Get Product',
    iconType: 'headphones',
    samplePrice: 'From ₹14,999'
  },
  {
    id: 'CELL PHONES',
    label: 'Cell Phones',
    sublabel: 'Get Product',
    iconType: 'smartphone',
    samplePrice: 'From ₹84,999'
  },
  {
    id: 'TABLETS',
    label: 'Tablet',
    sublabel: 'Get Product',
    iconType: 'tablet',
    samplePrice: 'From ₹32,999'
  }
];
