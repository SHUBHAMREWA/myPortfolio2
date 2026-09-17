import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

export default cloudinary;
