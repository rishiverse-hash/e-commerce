const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Placeholder routes
router.get('/dashboard/stats', protect, adminOnly, (req, res) => {
  res.json({ success: true, message: 'Admin routes coming soon' });
});

module.exports = router;