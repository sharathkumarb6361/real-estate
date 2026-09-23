const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { v2: cloudinary } = require('cloudinary');

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const provider = process.env.IMAGE_STORAGE_PROVIDER || 'local';
const maxSizeMb = Number(process.env.MAX_IMAGE_SIZE_MB || 5);

const validateImageFile = (file) => {
  if (!file || !allowedMimeTypes.has(file.mimetype)) {
    const error = new Error('Only JPEG, PNG, WEBP, and GIF images are allowed');
    error.status = 400;
    throw error;
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    const error = new Error(`Image must be smaller than ${maxSizeMb}MB`);
    error.status = 400;
    throw error;
  }
};

const uploadToCloudinary = (file) => new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'estatehub/properties', resource_type: 'image' },
    (error, result) => error ? reject(error) : resolve(result.secure_url)
  );
  uploadStream.end(file.buffer);
});

const uploadToLocal = async (file) => {
  const uploadDirectory = path.resolve(__dirname, '..', process.env.IMAGE_UPLOAD_DIR || 'uploads');
  await fs.promises.mkdir(uploadDirectory, { recursive: true });
  const extension = path.extname(file.originalname).toLowerCase() || '.jpg';
  const filename = `${crypto.randomUUID()}${extension}`;
  await fs.promises.writeFile(path.join(uploadDirectory, filename), file.buffer);
  const publicApiUrl = process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${publicApiUrl}/uploads/${filename}`;
};

const uploadImage = async (file) => {
  validateImageFile(file);

  if (provider === 'cloudinary') {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      const error = new Error('Cloudinary storage is not configured');
      error.status = 500;
      throw error;
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    return uploadToCloudinary(file);
  }

  return uploadToLocal(file);
};

module.exports = { uploadImage, validateImageFile, maxSizeMb };
