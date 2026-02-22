import type { Express } from "express";

import crypto from "node:crypto";
import path from "node:path";

import type { CloudinaryResult, ResourceType } from "@/core/types/service/cloudinary";

import cloudinary from "@/config/cloudinary";

export async function uploadToCloudinary(
  file: Express.Multer.File,
  options: {
    baseFolder: "images" | "videos" | "chat";
    subFolder: string;
    resourceType: ResourceType;
  },
): Promise<CloudinaryResult> {
  const { baseFolder, subFolder, resourceType } = options;
  const folder = `nexus/${baseFolder}/${subFolder}`;

  const filename = path.basename(file.originalname, path.extname(file.originalname));
  const uniqueSuffix = crypto.randomUUID();
  const publicId = `${filename}-${uniqueSuffix}`;

  try {
    const result = await new Promise<CloudinaryResult>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            public_id: publicId,
            resource_type: resourceType,
            type: "authenticated",
            overwrite: true,
            use_filename: false,
            unique_filename: false,
          },
          (error, result) => {
            if (error)
              return reject(error);
            if (!result)
              return reject(new Error("Upload failed: No result"));

            // Generate a secure, signed URL since type is "authenticated"
            const signedUrl = cloudinary.url(result.public_id, {
              type: "authenticated",
              sign_url: true,
              secure: true,
              resource_type: resourceType,
              format: result.format,
            });

            resolve({
              url: signedUrl,
              publicId: result.public_id,
            });
          },
        )
        .end(file.buffer);
    });
    return result;
  }
  catch (error) {
    throw new Error(`Upload failed: ${(error as Error).message}`);
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { type: "authenticated" });
  }
  catch (error) {
    throw new Error(`Delete failed: ${(error as Error).message}`);
  }
}

/**
 * Generates a signed, authenticated URL from a publicId.
 * This is useful if you want to store just the publicId in the DB
 * and generate the URL on-the-fly for maximum security.
 */
export function generateSignedUrl(
  publicId: string,
  options: { resourceType?: ResourceType; format?: string } = {},
): string {
  return cloudinary.url(publicId, {
    type: "authenticated",
    sign_url: true,
    secure: true,
    resource_type: options.resourceType || "image",
    format: options.format,
  });
}
