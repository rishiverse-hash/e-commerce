const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { AppError } = require('../utils/AppError');
const { asyncHandler } = require('../utils/asyncHandler');
const { sendEmail } = require('../utils/email');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// Helper function to generate tokens
const generateTokens = (user) => {
  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();
  return { accessToken, refreshToken };
};

// Helper function to set token cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('token', accessToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User already exists with this email', 400));
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password
  });

  // Generate email verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Send verification email
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Welcome to LimeRoad!',
      template: 'welcome',
      data: {
        name: user.firstName,
        verificationUrl
      }
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't fail registration if email fails
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Save refresh token to user
  user.refreshTokens.push({ token: refreshToken });
  await user.save({ validateBeforeSave: false });

  // Set cookies
  setTokenCookies(res, accessToken, refreshToken);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email for verification.',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      accessToken,
      refreshToken
    }
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password, rememberMe } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Check if account is locked
  if (user.isLocked()) {
    return next(new AppError('Account temporarily locked due to too many failed login attempts', 423));
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    // Increment login attempts
    await user.incLoginAttempts();
    return next(new AppError('Invalid email or password', 401));
  }

  // Check if account is active
  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 401));
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Save refresh token to user
  user.refreshTokens.push({ token: refreshToken });

  // Clean up old refresh tokens (keep only last 5)
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }

  await user.save({ validateBeforeSave: false });

  // Set cookies
  setTokenCookies(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
        lastLogin: user.lastLogin
      },
      accessToken,
      refreshToken
    }
  });
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (refreshToken) {
    // Remove refresh token from user
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { refreshTokens: { token: refreshToken } }
    });
  }

  // Clear cookies
  res.clearCookie('token');
  res.clearCookie('refreshToken');

  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
// @access  Public (but requires valid refresh token)
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const oldRefreshToken = req.refreshToken;

  // Generate new tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Replace old refresh token with new one
  const tokenIndex = user.refreshTokens.findIndex(tokenObj => tokenObj.token === oldRefreshToken);
  if (tokenIndex !== -1) {
    user.refreshTokens[tokenIndex] = { token: refreshToken };
  } else {
    user.refreshTokens.push({ token: refreshToken });
  }

  await user.save({ validateBeforeSave: false });

  // Set new cookies
  setTokenCookies(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken,
      refreshToken
    }
  });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if user exists or not
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  // Send reset email
  try {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      template: 'passwordReset',
      data: {
        name: user.firstName,
        resetUrl,
        expiryTime: '10 minutes'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Email could not be sent. Please try again later.', 500));
  }
});

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;

  // Hash token and find user
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Invalid or expired reset token', 400));
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Clear all refresh tokens for security
  user.refreshTokens = [];

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful. Please log in with your new password.'
  });
});

// @desc    Verify email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      email: decoded.email,
      emailVerificationToken: token,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('Invalid or expired verification token', 400));
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    return next(new AppError('Invalid verification token', 400));
  }
});

// @desc    Resend verification email
// @route   POST /api/v1/auth/resend-verification
// @access  Public
exports.resendVerification = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a verification email has been sent.'
    });
  }

  if (user.isEmailVerified) {
    return next(new AppError('Email is already verified', 400));
  }

  // Generate new verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Send verification email
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Email Verification',
      template: 'emailVerification',
      data: {
        name: user.firstName,
        verificationUrl
      }
    });

    res.status(200).json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    return next(new AppError('Email could not be sent. Please try again later.', 500));
  }
});

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isCurrentPasswordCorrect) {
    return next(new AppError('Current password is incorrect', 400));
  }

  // Update password
  user.password = newPassword;

  // Clear all refresh tokens for security
  user.refreshTokens = [];

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully. Please log in again.'
  });
});

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('addresses');

  res.status(200).json({
    success: true,
    data: { user }
  });
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const allowedFields = [
    'firstName', 'lastName', 'phone', 'dateOfBirth',
    'gender', 'preferences'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // Handle avatar upload
  if (req.files && req.files.avatar) {
    const user = await User.findById(req.user._id);

    // Delete old avatar if exists
    if (user.avatar && user.avatar.public_id) {
      await deleteFromCloudinary(user.avatar.public_id);
    }

    // Upload new avatar
    const result = await uploadToCloudinary(req.files.avatar.tempFilePath, {
      folder: 'avatars',
      width: 200,
      height: 200,
      crop: 'fill'
    });

    updates.avatar = {
      public_id: result.public_id,
      url: result.secure_url
    };
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
});

// @desc    Delete user account
// @route   DELETE /api/v1/auth/delete-account
// @access  Private
exports.deleteAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // Delete avatar from cloudinary
  if (user.avatar && user.avatar.public_id) {
    await deleteFromCloudinary(user.avatar.public_id);
  }

  // Soft delete - deactivate account
  user.isActive = false;
  user.email = `deleted_${Date.now()}_${user.email}`;
  user.refreshTokens = [];

  await user.save({ validateBeforeSave: false });

  // Clear cookies
  res.clearCookie('token');
  res.clearCookie('refreshToken');

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});