const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

// Sample categories
const categories = [
  {
    name: 'Electronics',
    description: 'Latest electronic gadgets and devices',
    slug: 'electronics',
    isActive: true,
    isFeatured: true,
    sortOrder: 1
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel for all occasions',
    slug: 'clothing',
    isActive: true,
    isFeatured: true,
    sortOrder: 2
  },
  {
    name: 'Home & Garden',
    description: 'Home decor and garden essentials',
    slug: 'home',
    isActive: true,
    isFeatured: true,
    sortOrder: 3
  },
  {
    name: 'Sports',
    description: 'Sports equipment and fitness gear',
    slug: 'sports',
    isActive: true,
    isFeatured: true,
    sortOrder: 4
  }
];

// Sample products for Electronics
const electronicsProducts = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Experience the power of pro photography and videography.',
    shortDescription: 'Premium smartphone with titanium design',
    price: 134900,
    comparePrice: 149900,
    sku: 'IPH15PM256',
    brand: 'Apple',
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
    onSale: true,
    salePrice: 129900,
    tags: ['smartphone', 'apple', 'premium', 'camera'],
    attributes: [
      { name: 'Storage', value: '256GB' },
      { name: 'Color', value: 'Natural Titanium' },
      { name: 'Display', value: '6.7-inch Super Retina XDR' }
    ]
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Flagship Android smartphone with S Pen, 200MP camera, and AI-powered features for productivity and creativity.',
    shortDescription: 'Premium Android smartphone with S Pen',
    price: 124900,
    comparePrice: 139900,
    sku: 'SGS24U512',
    brand: 'Samsung',
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
    tags: ['smartphone', 'samsung', 'android', 's-pen'],
    attributes: [
      { name: 'Storage', value: '512GB' },
      { name: 'Color', value: 'Titanium Black' },
      { name: 'RAM', value: '12GB' }
    ]
  },
  {
    name: 'MacBook Air M3',
    description: 'Ultra-thin laptop powered by Apple M3 chip. Perfect for students and professionals with all-day battery life.',
    shortDescription: 'Lightweight laptop with M3 chip',
    price: 114900,
    sku: 'MBA13M3256',
    brand: 'Apple',
    images: [
      {
        public_id: 'electronics/macbook-air',
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        alt: 'MacBook Air M3',
        isMain: true
      }
    ],
    stock: 15,
    tags: ['laptop', 'apple', 'macbook', 'portable'],
    attributes: [
      { name: 'Screen Size', value: '13.6-inch' },
      { name: 'Storage', value: '256GB SSD' },
      { name: 'RAM', value: '8GB' }
    ]
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones with exceptional sound quality and 30-hour battery life.',
    shortDescription: 'Premium noise-canceling headphones',
    price: 29900,
    comparePrice: 34900,
    sku: 'SNYWH1000XM5',
    brand: 'Sony',
    images: [
      {
        public_id: 'electronics/sony-headphones',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        alt: 'Sony WH-1000XM5',
        isMain: true
      }
    ],
    stock: 40,
    onSale: true,
    salePrice: 27900,
    tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
    attributes: [
      { name: 'Battery Life', value: '30 hours' },
      { name: 'Connectivity', value: 'Bluetooth 5.2' },
      { name: 'Weight', value: '250g' }
    ]
  },
  {
    name: 'iPad Pro 12.9-inch M2',
    description: 'Most advanced iPad with M2 chip, Liquid Retina XDR display, and support for Apple Pencil and Magic Keyboard.',
    shortDescription: 'Professional tablet with M2 chip',
    price: 109900,
    sku: 'IPADPRO129M2',
    brand: 'Apple',
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
    tags: ['tablet', 'apple', 'ipad', 'professional'],
    attributes: [
      { name: 'Screen Size', value: '12.9-inch' },
      { name: 'Storage', value: '256GB' },
      { name: 'Connectivity', value: 'Wi-Fi + Cellular' }
    ]
  }
];

// Sample products for Clothing
const clothingProducts = [
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt with modern fit. Perfect for casual wear and everyday comfort.',
    shortDescription: 'Organic cotton casual t-shirt',
    price: 1299,
    comparePrice: 1599,
    sku: 'TSHIRT001',
    brand: 'EcoWear',
    images: [
      {
        public_id: 'clothing/cotton-tshirt',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        alt: 'Premium Cotton T-Shirt',
        isMain: true
      }
    ],
    stock: 100,
    onSale: true,
    salePrice: 999,
    tags: ['t-shirt', 'cotton', 'casual', 'organic'],
    variants: [
      { name: 'Size', value: 'S', stock: 25 },
      { name: 'Size', value: 'M', stock: 30 },
      { name: 'Size', value: 'L', stock: 25 },
      { name: 'Size', value: 'XL', stock: 20 }
    ],
    attributes: [
      { name: 'Material', value: '100% Organic Cotton' },
      { name: 'Fit', value: 'Regular' },
      { name: 'Care', value: 'Machine Wash' }
    ]
  },
  {
    name: 'Denim Jeans - Slim Fit',
    description: 'Classic slim-fit denim jeans made from premium denim fabric. Comfortable stretch and timeless style.',
    shortDescription: 'Classic slim-fit denim jeans',
    price: 2999,
    sku: 'JEANS001',
    brand: 'DenimCo',
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
    tags: ['jeans', 'denim', 'slim-fit', 'casual'],
    variants: [
      { name: 'Waist', value: '30', stock: 15 },
      { name: 'Waist', value: '32', stock: 20 },
      { name: 'Waist', value: '34', stock: 20 },
      { name: 'Waist', value: '36', stock: 20 }
    ],
    attributes: [
      { name: 'Material', value: '98% Cotton, 2% Elastane' },
      { name: 'Fit', value: 'Slim' },
      { name: 'Rise', value: 'Mid Rise' }
    ]
  },
  {
    name: 'Formal Dress Shirt',
    description: 'Professional dress shirt perfect for office wear. Wrinkle-resistant fabric with classic collar design.',
    shortDescription: 'Professional wrinkle-resistant dress shirt',
    price: 2499,
    sku: 'SHIRT001',
    brand: 'FormalWear',
    images: [
      {
        public_id: 'clothing/dress-shirt',
        url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
        alt: 'Formal Dress Shirt',
        isMain: true
      }
    ],
    stock: 60,
    tags: ['shirt', 'formal', 'office', 'professional'],
    variants: [
      { name: 'Size', value: 'S', stock: 15 },
      { name: 'Size', value: 'M', stock: 20 },
      { name: 'Size', value: 'L', stock: 15 },
      { name: 'Size', value: 'XL', stock: 10 }
    ],
    attributes: [
      { name: 'Material', value: 'Cotton Blend' },
      { name: 'Collar', value: 'Spread Collar' },
      { name: 'Cuff', value: 'Button Cuff' }
    ]
  },
  {
    name: 'Women\'s Summer Dress',
    description: 'Elegant floral summer dress perfect for casual outings and special occasions. Lightweight and breathable fabric.',
    shortDescription: 'Elegant floral summer dress',
    price: 3499,
    comparePrice: 4299,
    sku: 'DRESS001',
    brand: 'FloralFashion',
    images: [
      {
        public_id: 'clothing/summer-dress',
        url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
        alt: 'Women Summer Dress',
        isMain: true
      }
    ],
    stock: 45,
    onSale: true,
    salePrice: 2999,
    featured: true,
    tags: ['dress', 'summer', 'floral', 'women'],
    variants: [
      { name: 'Size', value: 'XS', stock: 10 },
      { name: 'Size', value: 'S', stock: 15 },
      { name: 'Size', value: 'M', stock: 12 },
      { name: 'Size', value: 'L', stock: 8 }
    ],
    attributes: [
      { name: 'Material', value: 'Polyester Blend' },
      { name: 'Length', value: 'Knee Length' },
      { name: 'Sleeve', value: 'Short Sleeve' }
    ]
  },
  {
    name: 'Leather Jacket',
    description: 'Premium genuine leather jacket with classic biker style. Durable construction with multiple pockets.',
    shortDescription: 'Premium genuine leather biker jacket',
    price: 8999,
    sku: 'JACKET001',
    brand: 'LeatherCraft',
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
    tags: ['jacket', 'leather', 'biker', 'premium'],
    variants: [
      { name: 'Size', value: 'S', stock: 5 },
      { name: 'Size', value: 'M', stock: 8 },
      { name: 'Size', value: 'L', stock: 7 },
      { name: 'Size', value: 'XL', stock: 5 }
    ],
    attributes: [
      { name: 'Material', value: 'Genuine Leather' },
      { name: 'Lining', value: 'Polyester' },
      { name: 'Style', value: 'Biker' }
    ]
  }
];

// Sample products for Home & Garden
const homeProducts = [
  {
    name: 'Ceramic Dinner Set',
    description: 'Beautiful 16-piece ceramic dinner set perfect for family meals. Microwave and dishwasher safe.',
    shortDescription: '16-piece ceramic dinner set',
    price: 4999,
    comparePrice: 6499,
    sku: 'DINNER001',
    brand: 'HomeEssentials',
    images: [
      {
        public_id: 'home/dinner-set',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        alt: 'Ceramic Dinner Set',
        isMain: true
      }
    ],
    stock: 35,
    onSale: true,
    salePrice: 3999,
    featured: true,
    tags: ['dinnerware', 'ceramic', 'kitchen', 'family'],
    attributes: [
      { name: 'Material', value: 'Ceramic' },
      { name: 'Pieces', value: '16 pieces' },
      { name: 'Dishwasher Safe', value: 'Yes' }
    ]
  },
  {
    name: 'Indoor Plant Collection',
    description: 'Set of 3 beautiful indoor plants including snake plant, pothos, and peace lily. Perfect for home decoration.',
    shortDescription: 'Set of 3 indoor plants with pots',
    price: 2499,
    sku: 'PLANTS001',
    brand: 'GreenThumb',
    images: [
      {
        public_id: 'home/indoor-plants',
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
        alt: 'Indoor Plant Collection',
        isMain: true
      }
    ],
    stock: 50,
    tags: ['plants', 'indoor', 'decoration', 'air-purifying'],
    attributes: [
      { name: 'Plants Included', value: '3 varieties' },
      { name: 'Pot Size', value: '6 inch' },
      { name: 'Care Level', value: 'Easy' }
    ]
  },
  {
    name: 'LED Table Lamp',
    description: 'Modern LED table lamp with adjustable brightness and color temperature. Perfect for reading and work.',
    shortDescription: 'Adjustable LED table lamp',
    price: 3499,
    sku: 'LAMP001',
    brand: 'LightTech',
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
    tags: ['lamp', 'led', 'adjustable', 'modern'],
    attributes: [
      { name: 'Power', value: '12W LED' },
      { name: 'Brightness Levels', value: '5 levels' },
      { name: 'Color Temperature', value: '3000K-6500K' }
    ]
  },
  {
    name: 'Cotton Bed Sheet Set',
    description: 'Luxurious 100% cotton bed sheet set including fitted sheet, flat sheet, and pillowcases. Queen size.',
    shortDescription: '100% cotton bed sheet set - Queen',
    price: 3999,
    comparePrice: 4999,
    sku: 'BEDSHEET001',
    brand: 'ComfortHome',
    images: [
      {
        public_id: 'home/bed-sheets',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
        alt: 'Cotton Bed Sheet Set',
        isMain: true
      }
    ],
    stock: 30,
    onSale: true,
    salePrice: 3299,
    tags: ['bedding', 'cotton', 'queen', 'comfortable'],
    attributes: [
      { name: 'Material', value: '100% Cotton' },
      { name: 'Thread Count', value: '300 TC' },
      { name: 'Size', value: 'Queen' }
    ]
  },
  {
    name: 'Kitchen Knife Set',
    description: 'Professional 8-piece kitchen knife set with wooden block. High-carbon stainless steel blades.',
    shortDescription: '8-piece professional knife set',
    price: 5999,
    sku: 'KNIFE001',
    brand: 'ChefMaster',
    images: [
      {
        public_id: 'home/knife-set',
        url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500',
        alt: 'Kitchen Knife Set',
        isMain: true
      }
    ],
    stock: 25,
    featured: true,
    tags: ['kitchen', 'knives', 'professional', 'cooking'],
    attributes: [
      { name: 'Material', value: 'High-Carbon Steel' },
      { name: 'Pieces', value: '8 knives + block' },
      { name: 'Handle', value: 'Ergonomic' }
    ]
  }
];

// Sample products for Sports
const sportsProducts = [
  {
    name: 'Yoga Mat Premium',
    description: 'High-quality non-slip yoga mat made from eco-friendly TPE material. Perfect for yoga, pilates, and fitness.',
    shortDescription: 'Non-slip eco-friendly yoga mat',
    price: 2499,
    comparePrice: 2999,
    sku: 'YOGA001',
    brand: 'FitLife',
    images: [
      {
        public_id: 'sports/yoga-mat',
        url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
        alt: 'Yoga Mat Premium',
        isMain: true
      }
    ],
    stock: 60,
    onSale: true,
    salePrice: 1999,
    featured: true,
    tags: ['yoga', 'fitness', 'mat', 'eco-friendly'],
    attributes: [
      { name: 'Material', value: 'TPE' },
      { name: 'Thickness', value: '6mm' },
      { name: 'Size', value: '183cm x 61cm' }
    ]
  },
  {
    name: 'Dumbbell Set Adjustable',
    description: 'Adjustable dumbbell set with weight plates. Perfect for home gym and strength training workouts.',
    shortDescription: 'Adjustable dumbbell set for home gym',
    price: 8999,
    sku: 'DUMBBELL001',
    brand: 'PowerFit',
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
    tags: ['dumbbells', 'weights', 'strength', 'home-gym'],
    attributes: [
      { name: 'Weight Range', value: '5kg - 25kg per dumbbell' },
      { name: 'Material', value: 'Cast Iron' },
      { name: 'Grip', value: 'Textured Handle' }
    ]
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning technology. Perfect for daily runs and marathons.',
    shortDescription: 'Lightweight cushioned running shoes',
    price: 6999,
    comparePrice: 8499,
    sku: 'SHOES001',
    brand: 'RunTech',
    images: [
      {
        public_id: 'sports/running-shoes',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        alt: 'Running Shoes',
        isMain: true
      }
    ],
    stock: 45,
    onSale: true,
    salePrice: 5999,
    tags: ['shoes', 'running', 'lightweight', 'cushioned'],
    variants: [
      { name: 'Size', value: '7', stock: 8 },
      { name: 'Size', value: '8', stock: 12 },
      { name: 'Size', value: '9', stock: 15 },
      { name: 'Size', value: '10', stock: 10 }
    ],
    attributes: [
      { name: 'Upper Material', value: 'Mesh' },
      { name: 'Sole', value: 'Rubber' },
      { name: 'Drop', value: '10mm' }
    ]
  },
  {
    name: 'Cricket Bat Professional',
    description: 'Professional grade cricket bat made from premium English willow. Perfect for serious cricket players.',
    shortDescription: 'Professional English willow cricket bat',
    price: 12999,
    sku: 'CRICKET001',
    brand: 'CricketPro',
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
    tags: ['cricket', 'bat', 'professional', 'willow'],
    attributes: [
      { name: 'Wood Type', value: 'English Willow' },
      { name: 'Weight', value: '1.2kg - 1.3kg' },
      { name: 'Grade', value: 'Grade 1' }
    ]
  },
  {
    name: 'Badminton Racket Set',
    description: 'Professional badminton racket set with 2 rackets, shuttlecocks, and carrying case. Perfect for beginners and pros.',
    shortDescription: 'Complete badminton racket set',
    price: 4999,
    sku: 'BADMINTON001',
    brand: 'ShuttlePro',
    images: [
      {
        public_id: 'sports/badminton-set',
        url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500',
        alt: 'Badminton Racket Set',
        isMain: true
      }
    ],
    stock: 35,
    tags: ['badminton', 'racket', 'set', 'complete'],
    attributes: [
      { name: 'Rackets', value: '2 pieces' },
      { name: 'Material', value: 'Carbon Fiber' },
      { name: 'Weight', value: '85g each' }
    ]
  }
];

// Create admin user
const createAdminUser = async () => {
  const adminExists = await User.findOne({ email: 'admin@store.com' });
  if (!adminExists) {
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@store.com',
      password: 'admin123456',
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });
    await admin.save();
    console.log('Admin user created');
    return admin;
  }
  return adminExists;
};

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await createAdminUser();

    // Create categories
    const createdCategories = [];
    for (const categoryData of categories) {
      const category = new Category({
        ...categoryData,
        createdBy: adminUser._id
      });
      const savedCategory = await category.save();
      createdCategories.push(savedCategory);
      console.log(`Created category: ${savedCategory.name}`);
    }

    // Create products
    const allProducts = [
      ...electronicsProducts.map(p => ({ ...p, category: createdCategories[0]._id })),
      ...clothingProducts.map(p => ({ ...p, category: createdCategories[1]._id })),
      ...homeProducts.map(p => ({ ...p, category: createdCategories[2]._id })),
      ...sportsProducts.map(p => ({ ...p, category: createdCategories[3]._id }))
    ];

    for (const productData of allProducts) {
      const product = new Product({
        ...productData,
        createdBy: adminUser._id,
        status: 'active'
      });
      await product.save();
      console.log(`Created product: ${product.name}`);
    }

    console.log('Database seeded successfully!');
    console.log(`Created ${createdCategories.length} categories`);
    console.log(`Created ${allProducts.length} products`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };