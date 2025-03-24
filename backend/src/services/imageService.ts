import cloudinaryRepository from '../repositories/cloudinaryRepository';
import type { Express } from 'express';

interface ImageData {
  url: string;
  publicId: string;
}

class ImageService {
  async uploadImage(file: Express.Multer.File): Promise<ImageData> {
    return await cloudinaryRepository.uploadImage(file);
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinaryRepository.deleteImage(publicId);
  }
}

export default new ImageService();
