import { ImageData } from '@/core/types/cloudinary';
import type { Express } from 'express';

export interface IImageService {
  uploadImage(file: Express.Multer.File): Promise<ImageData>;
  deleteImage(publicId: string): Promise<void>;
}
