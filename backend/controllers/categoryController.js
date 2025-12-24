const Category = require('../models/Category');
const { AppError } = require('../utils/AppError');
const { asyncHandler } = require('../utils/asyncHandler');
const { categories: mockCategories } = require('../data/mockData');

// Check if MongoDB is connected
const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  if (!isMongoConnected()) {
    const categories = mockCategories
      .filter(cat => cat.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return res.status(200).json({
      success: true,
      data: { categories }
    });
  }

  const categories = await Category.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .select('name description slug image icon color isFeatured productCount');

  res.status(200).json({
    success: true,
    data: { categories }
  });
});

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  if (!isMongoConnected()) {
    const category = mockCategories.find(cat => cat._id === req.params.id);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    return res.status(200).json({
      success: true,
      data: { category }
    });
  }

  const category = await Category.findById(req.params.id)
    .populate('children', 'name slug description image');

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  res.status(200).json({
    success: true,
    data: { category }
  });
});

// @desc    Get category tree
// @route   GET /api/v1/categories/tree
// @access  Public
exports.getCategoryTree = asyncHandler(async (req, res, next) => {
  if (!isMongoConnected()) {
    const categories = mockCategories
      .filter(cat => cat.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return res.status(200).json({
      success: true,
      data: { categories }
    });
  }

  const tree = await Category.getCategoryTree();

  res.status(200).json({
    success: true,
    data: { categories: tree }
  });
});