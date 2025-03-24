import { ImageData } from '@/core/types/image';
import { Express } from 'express';

export interface ICloudinaryRepository {
  uploadImage(file: Express.Multer.File): Promise<ImageData>;
  deleteImage(publicId: string): Promise<void>;
}
