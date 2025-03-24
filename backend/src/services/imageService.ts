import { IImageService } from '@/core/interfaces/services/IImageService';
import type { Express } from 'express';
import { ImageData } from '@/core/types/image';
import { ICloudinaryRepository } from '@/core/interfaces/repositories/ICloudinaryRepository';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';

@injectable()
export class ImageService implements IImageService {
  constructor(
    @inject(TYPES.CloudinaryRepository) private cloudinaryRepository: ICloudinaryRepository
  ) {}
  async uploadImage(file: Express.Multer.File): Promise<ImageData> {
    return await this.cloudinaryRepository.uploadImage(file);
  }

  async deleteImage(publicId: string): Promise<void> {
    await this.cloudinaryRepository.deleteImage(publicId);
  }
}
