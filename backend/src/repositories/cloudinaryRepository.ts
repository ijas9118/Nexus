import cloudinary from '@/config/cloudinary';
import { Express } from 'express';

interface ImageData {
  url: string;
  publicId: string;
}

class CloudinaryRepository {
  async uploadImage(file: Express.Multer.File): Promise<ImageData> {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'nexus/images/profile-pic', // Store in a specific folder
        resource_type: 'image', // Explicitly specify as image
      });
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      throw new Error(`Upload failed: ${(error as Error).message}`);
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`Delete failed: ${(error as Error).message}`);
    }
  }
}

export default new CloudinaryRepository();
