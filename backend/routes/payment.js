const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder routes
router.post('/create-intent', protect, (req, res) => {
  res.json({ success: true, message: 'Payment routes coming soon' });
});

module.exports = router;