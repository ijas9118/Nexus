import cloudinary from '@/config/cloudinary';
import { CloudinaryResult, ResourceType } from '@/core/types/cloudinary';
import { Express } from 'express';
import path from 'path';

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  options: {
    baseFolder: 'images' | 'videos' | 'chat';
    subFolder: string;
    resourceType: ResourceType;
  }
): Promise<CloudinaryResult> => {
  const { baseFolder, subFolder, resourceType } = options;
  const folder = `nexus/${baseFolder}/${subFolder}`;

  const filename = path.basename(file.originalname, path.extname(file.originalname));

  console.log(filename);

  const publicId = `${folder}/${filename}`;

  try {
    const result = await new Promise<CloudinaryResult>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            public_id: publicId,
            resource_type: resourceType,
            overwrite: true,
            use_filename: true,
            unique_filename: false,
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('Upload failed: No result'));
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        )
        .end(file.buffer);
    });
    return result;
  } catch (error) {
    throw new Error(`Upload failed: ${(error as Error).message}`);
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Delete failed: ${(error as Error).message}`);
  }
};
