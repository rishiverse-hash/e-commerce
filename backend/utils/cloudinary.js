const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary
const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const defaultOptions = {
      folder: 'ecommerce',
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    };
    
    const uploadOptions = { ...defaultOptions, ...options };
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Image deletion failed');
  }
};

// Upload multiple images
const uploadMultipleToCloudinary = async (files, options = {}) => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, options));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw new Error('Multiple image upload failed');
  }
};

// Generate transformation URL
const generateTransformationUrl = (publicId, transformations) => {
  return cloudinary.url(publicId, transformations);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadMultipleToCloudinary,
  generateTransformationUrl,
  cloudinary,
};