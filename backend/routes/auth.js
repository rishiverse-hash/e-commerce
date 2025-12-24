const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  changePassword,
  getProfile,
  updateProfile,
  deleteAccount
} = require('../controllers/authController');
const { protect, verifyRefreshToken, sensitiveOperationLimit } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
];

const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid phone number'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
    .withMessage('Invalid gender selection')
];

// Public routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, sensitiveOperationLimit(5), login);
router.post('/refresh-token', verifyRefreshToken, refreshToken);
router.post('/forgot-password', forgotPasswordValidation, validateRequest, sensitiveOperationLimit(3), forgotPassword);
router.post('/reset-password', resetPasswordValidation, validateRequest, sensitiveOperationLimit(3), resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', forgotPasswordValidation, validateRequest, sensitiveOperationLimit(3), resendVerification);

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.post('/logout', logout);
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, validateRequest, updateProfile);
router.put('/change-password', changePasswordValidation, validateRequest, sensitiveOperationLimit(3), changePassword);
router.delete('/delete-account', sensitiveOperationLimit(1, 60 * 60 * 1000), deleteAccount); // 1 attempt per hour

module.exports = router;