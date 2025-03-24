import cloudinary from '@/config/cloudinary';
import { ICloudinaryRepository } from '@/core/interfaces/repositories/ICloudinaryRepository';
import { ImageData } from '@/core/types/image';
import { Express } from 'express';
import { injectable } from 'inversify';

@injectable()
export class CloudinaryRepository implements ICloudinaryRepository {
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
