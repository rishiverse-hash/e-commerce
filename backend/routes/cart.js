const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder routes
router.get('/', protect, (req, res) => {
  res.json({ success: true, message: 'Cart routes coming soon' });
});

module.exports = router;