const express = require('express');
const {
  getCategories,
  getCategory,
  getCategoryTree
} = require('../controllers/categoryController');

const router = express.Router();

// Public routes
router.get('/tree', getCategoryTree);
router.get('/:id', getCategory);
router.get('/', getCategories);

module.exports = router;