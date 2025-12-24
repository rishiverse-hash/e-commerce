const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  level: {
    type: Number,
    default: 0
  },
  path: {
    type: String,
    default: ''
  },
  image: {
    public_id: String,
    url: String,
    alt: String
  },
  icon: String,
  color: String,
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  productCount: {
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

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });

// Pre-save middleware to generate slug and set level/path
categorySchema.pre('save', async function(next) {
  // Generate slug if name is modified
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Set level and path based on parent
  if (this.isModified('parent')) {
    if (this.parent) {
      const parent = await this.constructor.findById(this.parent);
      if (parent) {
        this.level = parent.level + 1;
        this.path = parent.path ? `${parent.path}/${parent.slug}` : parent.slug;
      }
    } else {
      this.level = 0;
      this.path = '';
    }
  }
  
  next();
});

// Post-save middleware to update parent's children array
categorySchema.post('save', async function() {
  if (this.parent) {
    await this.constructor.findByIdAndUpdate(
      this.parent,
      { $addToSet: { children: this._id } }
    );
  }
});

// Pre-remove middleware to handle children and products
categorySchema.pre('remove', async function(next) {
  // Move children to parent or root level
  if (this.children.length > 0) {
    await this.constructor.updateMany(
      { _id: { $in: this.children } },
      { parent: this.parent || null }
    );
  }
  
  // Remove from parent's children array
  if (this.parent) {
    await this.constructor.findByIdAndUpdate(
      this.parent,
      { $pull: { children: this._id } }
    );
  }
  
  // Update products to remove this category
  const Product = mongoose.model('Product');
  await Product.updateMany(
    { category: this._id },
    { $unset: { category: 1 } }
  );
  
  next();
});

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function(parentId = null) {
  const categories = await this.find({ 
    parent: parentId,
    isActive: true 
  }).sort({ sortOrder: 1, name: 1 });
  
  const tree = [];
  
  for (const category of categories) {
    const children = await this.getCategoryTree(category._id);
    tree.push({
      ...category.toObject(),
      children
    });
  }
  
  return tree;
};

// Static method to get all descendants
categorySchema.statics.getDescendants = async function(categoryId) {
  const category = await this.findById(categoryId);
  if (!category) return [];
  
  let descendants = [];
  
  if (category.children.length > 0) {
    descendants = [...category.children];
    
    for (const childId of category.children) {
      const childDescendants = await this.getDescendants(childId);
      descendants = [...descendants, ...childDescendants];
    }
  }
  
  return descendants;
};

// Static method to get breadcrumb
categorySchema.statics.getBreadcrumb = async function(categoryId) {
  const category = await this.findById(categoryId);
  if (!category) return [];
  
  const breadcrumb = [category];
  
  if (category.parent) {
    const parentBreadcrumb = await this.getBreadcrumb(category.parent);
    breadcrumb.unshift(...parentBreadcrumb);
  }
  
  return breadcrumb;
};

// Method to update product count
categorySchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  const count = await Product.countDocuments({ 
    category: this._id,
    status: 'active'
  });
  
  this.productCount = count;
  await this.save();
  
  return count;
};

// Virtual for full path
categorySchema.virtual('fullPath').get(function() {
  return this.path ? `${this.path}/${this.slug}` : this.slug;
});

// Transform output
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Category', categorySchema);