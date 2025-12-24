// Mock categories
const categories = [
  {
    _id: '1',
    name: 'Electronics',
    description: 'Latest electronic gadgets and devices',
    slug: 'electronics',
    isActive: true,
    isFeatured: true,
    sortOrder: 1
  },
  {
    _id: '2',
    name: 'Clothing',
    description: 'Fashion and apparel for all occasions',
    slug: 'clothing',
    isActive: true,
    isFeatured: true,
    sortOrder: 2
  },
  {
    _id: '3',
    name: 'Home & Garden',
    description: 'Home decor and garden essentials',
    slug: 'home',
    isActive: true,
    isFeatured: true,
    sortOrder: 3
  },
  {
    _id: '4',
    name: 'Sports',
    description: 'Sports equipment and fitness gear',
    slug: 'sports',
    isActive: true,
    isFeatured: true,
    sortOrder: 4
  }
];

// Mock products
const products = [
  // Electronics
  {
    _id: 'prod1',
    name: 'iPhone 15 Pro Max',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Experience the power of pro photography and videography.',
    shortDescription: 'Premium smartphone with titanium design',
    price: 134900,
    comparePrice: 149900,
    salePrice: 129900,
    onSale: true,
    sku: 'IPH15PM256',
    brand: 'Apple',
    category: { _id: '1', name: 'Electronics', slug: 'electronics' },
    images: [
      {
        public_id: 'electronics/iphone15pro',
        url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
        alt: 'iPhone 15 Pro Max',
        isMain: true
      }
    ],
    stock: 25,
    featured: true,
    status: 'active',
    ratings: { average: 4.8, count: 156 },
    tags: ['smartphone', 'apple', 'premium', 'camera', 'unisex', 'men', 'women'],
    createdAt: new Date('2024-01-15'),
    seo: { slug: 'iphone-15-pro-max' }
  },
  {
    _id: 'prod2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Flagship Android smartphone with S Pen, 200MP camera, and AI-powered features for productivity and creativity.',
    shortDescription: 'Premium Android smartphone with S Pen',
    price: 124900,
    comparePrice: 139900,
    onSale: false,
    sku: 'SGS24U512',
    brand: 'Samsung',
    category: { _id: '1', name: 'Electronics', slug: 'electronics' },
    images: [
      {
        public_id: 'electronics/galaxy-s24',
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        alt: 'Samsung Galaxy S24 Ultra',
        isMain: true
      }
    ],
    stock: 30,
    featured: true,
    status: 'active',
    ratings: { average: 4.7, count: 89 },
    tags: ['smartphone', 'samsung', 'android', 's-pen', 'unisex', 'men', 'women'],
    createdAt: new Date('2024-01-10'),
    seo: { slug: 'samsung-galaxy-s24-ultra' }
  },
  {
    _id: 'prod3',
    name: 'MacBook Air M3',
    description: 'Ultra-thin laptop powered by Apple M3 chip. Perfect for students and professionals with all-day battery life.',
    shortDescription: 'Lightweight laptop with M3 chip',
    price: 114900,
    onSale: false,
    sku: 'MBA13M3256',
    brand: 'Apple',
    category: { _id: '1', name: 'Electronics', slug: 'electronics' },
    images: [
      {
        public_id: 'electronics/macbook-air',
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        alt: 'MacBook Air M3',
        isMain: true
      }
    ],
    stock: 15,
    featured: false,
    status: 'active',
    ratings: { average: 4.9, count: 234 },
    tags: ['laptop', 'apple', 'macbook', 'portable'],
    createdAt: new Date('2024-01-05'),
    seo: { slug: 'macbook-air-m3' }
  },
  {
    _id: 'prod4',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones with exceptional sound quality and 30-hour battery life.',
    shortDescription: 'Premium noise-canceling headphones',
    price: 29900,
    comparePrice: 34900,
    salePrice: 27900,
    onSale: true,
    sku: 'SNYWH1000XM5',
    brand: 'Sony',
    category: { _id: '1', name: 'Electronics', slug: 'electronics' },
    images: [
      {
        public_id: 'electronics/sony-headphones',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        alt: 'Sony WH-1000XM5',
        isMain: true
      }
    ],
    stock: 40,
    featured: true,
    status: 'active',
    ratings: { average: 4.6, count: 178 },
    tags: ['headphones', 'sony', 'wireless', 'noise-canceling', 'unisex', 'men', 'women', 'kids'],
    createdAt: new Date('2024-01-12'),
    seo: { slug: 'sony-wh-1000xm5-headphones' }
  },
  {
    _id: 'prod5',
    name: 'iPad Pro 12.9-inch M2',
    description: 'Most advanced iPad with M2 chip, Liquid Retina XDR display, and support for Apple Pencil and Magic Keyboard.',
    shortDescription: 'Professional tablet with M2 chip',
    price: 109900,
    onSale: false,
    sku: 'IPADPRO129M2',
    brand: 'Apple',
    category: { _id: '1', name: 'Electronics', slug: 'electronics' },
    images: [
      {
        public_id: 'electronics/ipad-pro',
        url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
        alt: 'iPad Pro 12.9-inch',
        isMain: true
      }
    ],
    stock: 20,
    featured: true,
    status: 'active',
    ratings: { average: 4.8, count: 145 },
    tags: ['tablet', 'apple', 'ipad', 'professional'],
    createdAt: new Date('2024-01-08'),
    seo: { slug: 'ipad-pro-129-inch-m2' }
  },

  // Clothing
  {
    _id: 'prod6',
    name: 'Premium Cotton T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt with modern fit. Perfect for casual wear and everyday comfort.',
    shortDescription: 'Organic cotton casual t-shirt',
    price: 1299,
    comparePrice: 1599,
    salePrice: 999,
    onSale: true,
    sku: 'TSHIRT001',
    brand: 'EcoWear',
    category: { _id: '2', name: 'Clothing', slug: 'clothing' },
    images: [
      {
        public_id: 'clothing/cotton-tshirt',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        alt: 'Premium Cotton T-Shirt',
        isMain: true
      }
    ],
    stock: 100,
    featured: false,
    status: 'active',
    ratings: { average: 4.3, count: 67 },
    tags: ['t-shirt', 'cotton', 'casual', 'organic', 'unisex', 'men', 'women'],
    createdAt: new Date('2024-01-14'),
    seo: { slug: 'premium-cotton-t-shirt' }
  },
  {
    _id: 'prod7',
    name: 'Denim Jeans - Slim Fit',
    description: 'Classic slim-fit denim jeans made from premium denim fabric. Comfortable stretch and timeless style.',
    shortDescription: 'Classic slim-fit denim jeans',
    price: 2999,
    onSale: false,
    sku: 'JEANS001',
    brand: 'DenimCo',
    category: { _id: '2', name: 'Clothing', slug: 'clothing' },
    images: [
      {
        public_id: 'clothing/denim-jeans',
        url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        alt: 'Denim Jeans Slim Fit',
        isMain: true
      }
    ],
    stock: 75,
    featured: true,
    status: 'active',
    ratings: { average: 4.5, count: 123 },
    tags: ['jeans', 'denim', 'slim-fit', 'casual', 'men'],
    createdAt: new Date('2024-01-11'),
    seo: { slug: 'denim-jeans-slim-fit' }
  },
  {
    _id: 'prod8',
    name: 'Formal Dress Shirt',
    description: 'Professional dress shirt perfect for office wear. Wrinkle-resistant fabric with classic collar design.',
    shortDescription: 'Professional wrinkle-resistant dress shirt',
    price: 2499,
    onSale: false,
    sku: 'SHIRT001',
    brand: 'FormalWear',
    category: { _id: '2', name: 'Clothing', slug: 'clothing' },
    images: [
      {
        public_id: 'clothing/dress-shirt',
        url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
        alt: 'Formal Dress Shirt',
        isMain: true
      }
    ],
    stock: 60,
    featured: false,
    status: 'active',
    ratings: { average: 4.2, count: 45 },
    tags: ['shirt', 'formal', 'office', 'professional', 'men'],
    createdAt: new Date('2024-01-09'),
    seo: { slug: 'formal-dress-shirt' }
  },
  {
    _id: 'prod9',
    name: 'Women\'s Summer Dress',
    description: 'Elegant floral summer dress perfect for casual outings and special occasions. Lightweight and breathable fabric.',
    shortDescription: 'Elegant floral summer dress',
    price: 3499,
    comparePrice: 4299,
    salePrice: 2999,
    onSale: true,
    sku: 'DRESS001',
    brand: 'FloralFashion',
    category: { _id: '2', name: 'Clothing', slug: 'clothing' },
    images: [
      {
        public_id: 'clothing/summer-dress',
        url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
        alt: 'Women Summer Dress',
        isMain: true
      }
    ],
    stock: 45,
    featured: true,
    status: 'active',
    ratings: { average: 4.7, count: 89 },
    tags: ['dress', 'summer', 'floral', 'women'],
    createdAt: new Date('2024-01-13'),
    seo: { slug: 'womens-summer-dress' }
  },
  {
    _id: 'prod10',
    name: 'Leather Jacket',
    description: 'Premium genuine leather jacket with classic biker style. Durable construction with multiple pockets.',
    shortDescription: 'Premium genuine leather biker jacket',
    price: 8999,
    onSale: false,
    sku: 'JACKET001',
    brand: 'LeatherCraft',
    category: { _id: '2', name: 'Clothing', slug: 'clothing' },
    images: [
      {
        public_id: 'clothing/leather-jacket',
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        alt: 'Leather Jacket',
        isMain: true
      }
    ],
    stock: 25,
    featured: true,
    status: 'active',
    ratings: { average: 4.8, count: 67 },
    tags: ['jacket', 'leather', 'biker', 'premium', 'men', 'women'],
    createdAt: new Date('2024-01-07'),
    seo: { slug: 'leather-jacket' }
  },

  // Home & Garden
  {
    _id: 'prod11',
    name: 'Ceramic Dinner Set',
    description: 'Beautiful 16-piece ceramic dinner set perfect for family meals. Microwave and dishwasher safe.',
    shortDescription: '16-piece ceramic dinner set',
    price: 4999,
    comparePrice: 6499,
    salePrice: 3999,
    onSale: true,
    sku: 'DINNER001',
    brand: 'HomeEssentials',
    category: { _id: '3', name: 'Home & Garden', slug: 'home' },
    images: [
      {
        public_id: 'home/dinner-set',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        alt: 'Ceramic Dinner Set',
        isMain: true
      }
    ],
    stock: 35,
    featured: true,
    status: 'active',
    ratings: { average: 4.4, count: 78 },
    tags: ['dinnerware', 'ceramic', 'kitchen', 'family'],
    createdAt: new Date('2024-01-06'),
    seo: { slug: 'ceramic-dinner-set' }
  },
  {
    _id: 'prod12',
    name: 'Indoor Plant Collection',
    description: 'Set of 3 beautiful indoor plants including snake plant, pothos, and peace lily. Perfect for home decoration.',
    shortDescription: 'Set of 3 indoor plants with pots',
    price: 2499,
    onSale: false,
    sku: 'PLANTS001',
    brand: 'GreenThumb',
    category: { _id: '3', name: 'Home & Garden', slug: 'home' },
    images: [
      {
        public_id: 'home/indoor-plants',
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
        alt: 'Indoor Plant Collection',
        isMain: true
      }
    ],
    stock: 50,
    featured: false,
    status: 'active',
    ratings: { average: 4.6, count: 92 },
    tags: ['plants', 'indoor', 'decoration', 'air-purifying'],
    createdAt: new Date('2024-01-04'),
    seo: { slug: 'indoor-plant-collection' }
  },
  {
    _id: 'prod13',
    name: 'LED Table Lamp',
    description: 'Modern LED table lamp with adjustable brightness and color temperature. Perfect for reading and work.',
    shortDescription: 'Adjustable LED table lamp',
    price: 3499,
    onSale: false,
    sku: 'LAMP001',
    brand: 'LightTech',
    category: { _id: '3', name: 'Home & Garden', slug: 'home' },
    images: [
      {
        public_id: 'home/table-lamp',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        alt: 'LED Table Lamp',
        isMain: true
      }
    ],
    stock: 40,
    featured: true,
    status: 'active',
    ratings: { average: 4.3, count: 56 },
    tags: ['lamp', 'led', 'adjustable', 'modern'],
    createdAt: new Date('2024-01-03'),
    seo: { slug: 'led-table-lamp' }
  },
  {
    _id: 'prod14',
    name: 'Cotton Bed Sheet Set',
    description: 'Luxurious 100% cotton bed sheet set including fitted sheet, flat sheet, and pillowcases. Queen size.',
    shortDescription: '100% cotton bed sheet set - Queen',
    price: 3999,
    comparePrice: 4999,
    salePrice: 3299,
    onSale: true,
    sku: 'BEDSHEET001',
    brand: 'ComfortHome',
    category: { _id: '3', name: 'Home & Garden', slug: 'home' },
    images: [
      {
        public_id: 'home/bed-sheets',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
        alt: 'Cotton Bed Sheet Set',
        isMain: true
      }
    ],
    stock: 30,
    featured: false,
    status: 'active',
    ratings: { average: 4.5, count: 134 },
    tags: ['bedding', 'cotton', 'queen', 'comfortable'],
    createdAt: new Date('2024-01-02'),
    seo: { slug: 'cotton-bed-sheet-set' }
  },
  {
    _id: 'prod15',
    name: 'Kitchen Knife Set',
    description: 'Professional 8-piece kitchen knife set with wooden block. High-carbon stainless steel blades.',
    shortDescription: '8-piece professional knife set',
    price: 5999,
    onSale: false,
    sku: 'KNIFE001',
    brand: 'ChefMaster',
    category: { _id: '3', name: 'Home & Garden', slug: 'home' },
    images: [
      {
        public_id: 'home/knife-set',
        url: 'https://images.unsplash.com/photo-1593618998160-e34015e672a9?auto=format&fit=crop&w=800&q=80',
        alt: 'Kitchen Knife Set',
        isMain: true
      }
    ],
    stock: 25,
    featured: true,
    status: 'active',
    ratings: { average: 4.7, count: 89 },
    tags: ['kitchen', 'knives', 'professional', 'cooking'],
    createdAt: new Date('2024-01-01'),
    seo: { slug: 'kitchen-knife-set' }
  },

  // Sports
  {
    _id: 'prod16',
    name: 'Yoga Mat Premium',
    description: 'High-quality non-slip yoga mat made from eco-friendly TPE material. Perfect for yoga, pilates, and fitness.',
    shortDescription: 'Non-slip eco-friendly yoga mat',
    price: 2499,
    comparePrice: 2999,
    salePrice: 1999,
    onSale: true,
    sku: 'YOGA001',
    brand: 'FitLife',
    category: { _id: '4', name: 'Sports', slug: 'sports' },
    images: [
      {
        public_id: 'sports/yoga-mat',
        url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
        alt: 'Yoga Mat Premium',
        isMain: true
      }
    ],
    stock: 60,
    featured: true,
    status: 'active',
    ratings: { average: 4.5, count: 167 },
    tags: ['yoga', 'fitness', 'mat', 'eco-friendly', 'unisex', 'women', 'men'],
    createdAt: new Date('2023-12-30'),
    seo: { slug: 'yoga-mat-premium' }
  },
  {
    _id: 'prod17',
    name: 'Dumbbell Set Adjustable',
    description: 'Adjustable dumbbell set with weight plates. Perfect for home gym and strength training workouts.',
    shortDescription: 'Adjustable dumbbell set for home gym',
    price: 8999,
    onSale: false,
    sku: 'DUMBBELL001',
    brand: 'PowerFit',
    category: { _id: '4', name: 'Sports', slug: 'sports' },
    images: [
      {
        public_id: 'sports/dumbbell-set',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
        alt: 'Dumbbell Set',
        isMain: true
      }
    ],
    stock: 20,
    featured: true,
    status: 'active',
    ratings: { average: 4.6, count: 78 },
    tags: ['dumbbells', 'weights', 'strength', 'home-gym'],
    createdAt: new Date('2023-12-29'),
    seo: { slug: 'dumbbell-set-adjustable' }
  },
  {
    _id: 'prod18',
    name: 'Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning technology. Perfect for daily runs and marathons.',
    shortDescription: 'Lightweight cushioned running shoes',
    price: 6999,
    comparePrice: 8499,
    salePrice: 5999,
    onSale: true,
    sku: 'SHOES001',
    brand: 'RunTech',
    category: { _id: '4', name: 'Sports', slug: 'sports' },
    images: [
      {
        public_id: 'sports/running-shoes',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        alt: 'Running Shoes',
        isMain: true
      }
    ],
    stock: 45,
    featured: false,
    status: 'active',
    ratings: { average: 4.4, count: 156 },
    tags: ['shoes', 'running', 'lightweight', 'cushioned'],
    createdAt: new Date('2023-12-28'),
    seo: { slug: 'running-shoes' }
  },
  {
    _id: 'prod19',
    name: 'Cricket Bat Professional',
    description: 'Professional grade cricket bat made from premium English willow. Perfect for serious cricket players.',
    shortDescription: 'Professional English willow cricket bat',
    price: 12999,
    onSale: false,
    sku: 'CRICKET001',
    brand: 'CricketPro',
    category: { _id: '4', name: 'Sports', slug: 'sports' },
    images: [
      {
        public_id: 'sports/cricket-bat',
        url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500',
        alt: 'Cricket Bat',
        isMain: true
      }
    ],
    stock: 15,
    featured: true,
    status: 'active',
    ratings: { average: 4.8, count: 45 },
    tags: ['cricket', 'bat', 'professional', 'willow'],
    createdAt: new Date('2023-12-27'),
    seo: { slug: 'cricket-bat-professional' }
  },
  {
    _id: 'prod20',
    name: 'Badminton Racket Set',
    description: 'Professional badminton racket set with 2 rackets, shuttlecocks, and carrying case. Perfect for beginners and pros.',
    shortDescription: 'Complete badminton racket set',
    price: 4999,
    onSale: false,
    sku: 'BADMINTON001',
    brand: 'ShuttlePro',
    category: { _id: '4', name: 'Sports', slug: 'sports' },
    images: [
      {
        public_id: 'sports/badminton-set',
        url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500',
        alt: 'Badminton Racket Set',
        isMain: true
      }
    ],
    stock: 35,
    featured: false,
    status: 'active',
    ratings: { average: 4.3, count: 67 },
    tags: ['badminton', 'racket', 'set', 'complete', 'unisex', 'men', 'women', 'kids'],
    createdAt: new Date('2023-12-26'),
    seo: { slug: 'badminton-racket-set' }
  }
];

module.exports = { categories, products };