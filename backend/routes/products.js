const express = require('express');
const {
  getProducts,
  getProduct,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  searchProducts
} = require('../controllers/productController');

const router = express.Router();

// Public routes
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);
router.get('/:id', getProduct);
router.get('/', getProducts);

module.exports = router;