const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Reviews routes coming soon' });
});

module.exports = router;