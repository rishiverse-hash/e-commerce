const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  barcode: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: String,
    trim: true
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  variants: [{
    name: String, // e.g., "Size", "Color"
    value: String, // e.g., "Large", "Red"
    price: Number,
    sku: String,
    stock: {
      type: Number,
      default: 0
    },
    images: [{
      public_id: String,
      url: String,
      alt: String
    }]
  }],
  attributes: [{
    name: String, // e.g., "Material", "Weight"
    value: String // e.g., "Cotton", "1.5kg"
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  trackQuantity: {
    type: Boolean,
    default: true
  },
  allowBackorder: {
    type: Boolean,
    default: false
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'g', 'lb', 'oz'],
      default: 'kg'
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'in', 'm'],
      default: 'cm'
    }
  },
  shipping: {
    free: {
      type: Boolean,
      default: false
    },
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
    slug: {
      type: String,
      unique: true,
      lowercase: true
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  tags: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'archived'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  onSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative']
  },
  saleStartDate: Date,
  saleEndDate: Date,
  isDigital: {
    type: Boolean,
    default: false
  },
  downloadableFiles: [{
    name: String,
    url: String,
    size: Number
  }],
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  crossSellProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  upSellProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  purchaseCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ featured: 1 });
productSchema.index({ status: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ 'seo.slug': 1 });
productSchema.index({ createdAt: -1 });

// Virtual for main image
productSchema.virtual('mainImage').get(function() {
  const mainImg = this.images.find(img => img.isMain);
  return mainImg || this.images[0];
});

// Virtual for current price (considering sale)
productSchema.virtual('currentPrice').get(function() {
  if (this.onSale && this.salePrice && 
      (!this.saleStartDate || this.saleStartDate <= new Date()) &&
      (!this.saleEndDate || this.saleEndDate >= new Date())) {
    return this.salePrice;
  }
  return this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.onSale && this.salePrice && this.price > this.salePrice) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (!this.trackQuantity) return 'in-stock';
  if (this.stock <= 0) return this.allowBackorder ? 'backorder' : 'out-of-stock';
  if (this.stock <= this.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Method to update ratings
productSchema.methods.updateRatings = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ product: this._id });
  
  if (reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
    this.ratings.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    return;
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  this.ratings.average = Math.round((totalRating / reviews.length) * 10) / 10;
  this.ratings.count = reviews.length;
  
  // Update distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(review => {
    distribution[review.rating]++;
  });
  this.ratings.distribution = distribution;
  
  await this.save();
};

// Method to check if product is available
productSchema.methods.isAvailable = function(quantity = 1) {
  if (!this.trackQuantity) return true;
  if (this.stock >= quantity) return true;
  return this.allowBackorder;
};

// Method to reserve stock
productSchema.methods.reserveStock = async function(quantity) {
  if (!this.trackQuantity) return true;
  
  if (this.stock >= quantity) {
    this.stock -= quantity;
    await this.save();
    return true;
  }
  
  if (this.allowBackorder) {
    this.stock = Math.max(0, this.stock - quantity);
    await this.save();
    return true;
  }
  
  return false;
};

// Method to release stock
productSchema.methods.releaseStock = async function(quantity) {
  if (!this.trackQuantity) return;
  
  this.stock += quantity;
  await this.save();
};

// Transform output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);