export interface CloudinaryResult {
  url: string;
  publicId: string;
}

export type ResourceType = "image" | "video" | "raw";

export const mimeToResourceType = {
  "image/jpeg": "image",
  "image/jpg": "image",
  "image/png": "image",
  "image/webp": "image",
  "video/mp4": "video",
  "video/quicktime": "video",
  "video/x-msvideo": "video",
  "application/pdf": "raw",
};

export const subFolderMap = {
  image: "images",
  video: "videos",
  raw: "documents",
};
