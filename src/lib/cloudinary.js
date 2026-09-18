import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dkc2fkpkp',
  api_key: process.env.CLOUDINARY_API_KEY || '738449759794842',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'L1ZCosHVz3dLyRPHIsRAnph0A0w',
  secure: true,
});

/**
 * Upload a file buffer to Cloudinary using upload_stream
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Target Cloudinary folder (default: 'portfoliophoto')
 * @returns {Promise<Object>}
 */
export async function uploadToCloudinary(buffer, folder = 'portfoliophoto') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp',
        transformation: [
          { quality: 'auto:good', fetch_format: 'webp' }
        ],
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload_stream error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

export default cloudinary;
