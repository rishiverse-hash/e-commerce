const Product = require('../models/Product');
const Category = require('../models/Category');
const { AppError } = require('../utils/AppError');
const { asyncHandler } = require('../utils/asyncHandler');
const { categories: mockCategories, products: mockProducts } = require('../data/mockData');

// Check if MongoDB is connected
const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 12,
    category,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    minPrice,
    maxPrice,
    brand,
    rating,
    featured,
    gender
  } = req.query;

  if (!isMongoConnected()) {
    // Use mock data
    let filteredProducts = [...mockProducts];

    // Gender filter
    if (gender) {
      const g = gender.toLowerCase();
      if (g === 'kids') {
        filteredProducts = filteredProducts.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === 'kids'));
      } else {
        const targetTags = [g, 'unisex'];
        filteredProducts = filteredProducts.filter(p =>
          p.tags && p.tags.some(t => targetTags.includes(t.toLowerCase()))
        );
      }
    }

    // Category filter
    if (category) {
      const categoryDoc = mockCategories.find(cat =>
        cat.slug === category || cat._id === category
      );
      if (categoryDoc) {
        filteredProducts = filteredProducts.filter(p => p.category._id === categoryDoc._id);
      }
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Price filter
    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice));
    }

    // Brand filter
    if (brand) {
      filteredProducts = filteredProducts.filter(p =>
        p.brand && p.brand.toLowerCase().includes(brand.toLowerCase())
      );
    }

    // Rating filter
    if (rating) {
      filteredProducts = filteredProducts.filter(p => p.ratings.average >= Number(rating));
    }

    // Featured filter
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured);
    }

    // Sort
    filteredProducts.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(skip, skip + Number(limit));
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalProducts: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  }

  // MongoDB logic (original code)
  const query = { status: 'active' };

  if (gender) {
    const g = gender.toLowerCase();
    if (g === 'kids') {
      query.tags = { $in: [new RegExp('kids', 'i')] };
    } else {
      query.tags = { $in: [new RegExp(g, 'i'), new RegExp('unisex', 'i')] };
    }
  }

  if (category) {
    const categoryDoc = await Category.findOne({
      $or: [{ slug: category }, { _id: category }]
    });
    if (categoryDoc) {
      query.category = categoryDoc._id;
    }
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (brand) {
    query.brand = { $regex: brand, $options: 'i' };
  }

  if (rating) {
    query['ratings.average'] = { $gte: Number(rating) };
  }

  if (featured === 'true') {
    query.featured = true;
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Product.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  // Force fix for Kitchen Knife Set image logic
  if (products) {
    products.forEach(p => {
      if (p.name.includes('Knife')) {
        // Manually set a working image array using a known valid URL
        p.images = [
          {
            public_id: '/Users/rishi/Downloads/knives.jpeg',
            url: '/assets/products/kai-knife-set.jpg',
            alt: 'Kai Premium Kitchen Knife Set',
            isMain: true
          }
        ];
      }
    });
  }

  res.status(200).json({
    success: true,
    data: {
      products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  if (!isMongoConnected()) {
    const product = mockProducts.find(p => p._id === req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    return res.status(200).json({
      success: true,
      data: { product }
    });
  }

  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('reviews', 'rating comment user createdAt');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  product.viewCount += 1;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: { product }
  });
});

// @desc    Get product by slug
// @route   GET /api/v1/products/slug/:slug
// @access  Public
exports.getProductBySlug = asyncHandler(async (req, res, next) => {
  if (!isMongoConnected()) {
    const product = mockProducts.find(p => p.seo.slug === req.params.slug);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    return res.status(200).json({
      success: true,
      data: { product }
    });
  }

  const product = await Product.findOne({ 'seo.slug': req.params.slug })
    .populate('category', 'name slug')
    .populate('reviews', 'rating comment user createdAt');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  product.viewCount += 1;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: { product }
  });
});

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const { limit = 8 } = req.query;

  if (!isMongoConnected()) {
    const featuredProducts = mockProducts
      .filter(p => p.featured && p.status === 'active')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, Number(limit));

    return res.status(200).json({
      success: true,
      data: { products: featuredProducts }
    });
  }

  const products = await Product.find({
    status: 'active',
    featured: true
  })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    data: { products }
  });
});

// @desc    Get related products
// @route   GET /api/v1/products/:id/related
// @access  Public
exports.getRelatedProducts = asyncHandler(async (req, res, next) => {
  if (!isMongoConnected()) {
    const product = mockProducts.find(p => p._id === req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const relatedProducts = mockProducts
      .filter(p => p._id !== product._id && p.category._id === product.category._id && p.status === 'active')
      .slice(0, 4);

    return res.status(200).json({
      success: true,
      data: { products: relatedProducts }
    });
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    status: 'active'
  })
    .populate('category', 'name slug')
    .limit(4)
    .sort({ viewCount: -1 });

  res.status(200).json({
    success: true,
    data: { products: relatedProducts }
  });
});

// @desc    Search products
// @route   GET /api/v1/products/search
// @access  Public
exports.searchProducts = asyncHandler(async (req, res, next) => {
  const { q, limit = 10 } = req.query;

  if (!q) {
    return next(new AppError('Search query is required', 400));
  }

  if (!isMongoConnected()) {
    const searchLower = q.toLowerCase();
    const searchResults = mockProducts
      .filter(p =>
        p.status === 'active' && (
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      )
      .slice(0, Number(limit));

    return res.status(200).json({
      success: true,
      data: { products: searchResults }
    });
  }

  const products = await Product.find({
    status: 'active',
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } }
    ]
  })
    .populate('category', 'name slug')
    .limit(Number(limit))
    .sort({ viewCount: -1 });

  res.status(200).json({
    success: true,
    data: { products }
  });
});