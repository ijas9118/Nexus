import multer from "multer";
import path from "node:path";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|mp4|mov|avi|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const allowedMimeTypes = {
      image: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
      video: ["video/mp4", "video/quicktime", "video/x-msvideo"],
      pdf: ["application/pdf"],
    };

    const sizeLimits = {
      image: 5 * 1024 * 1024, // 5MB for images
      video: 50 * 1024 * 1024, // 50MB for videos
      pdf: 10 * 1024 * 1024, // 10MB for PDFs
    };

    let fileCategory: "image" | "video" | "pdf" | null = null;
    if (allowedMimeTypes.image.includes(file.mimetype)) {
      fileCategory = "image";
    }
    else if (allowedMimeTypes.video.includes(file.mimetype)) {
      fileCategory = "video";
    }
    else if (allowedMimeTypes.pdf.includes(file.mimetype)) {
      fileCategory = "pdf";
    }

    if (!extname || !fileCategory) {
      return cb(
        new Error(
          "Only images (JPEG, JPG, PNG, WEBP), videos (MP4, MOV, AVI), and PDFs are allowed",
        ),
      );
    }

    if (file.size > sizeLimits[fileCategory]) {
      return cb(
        new Error(
          `${fileCategory === "image" ? "Images" : fileCategory === "video" ? "Videos" : "PDFs"} must be smaller than ${sizeLimits[fileCategory] / (1024 * 1024)}MB`,
        ),
      );
    }

    cb(null, true);
  },
});

export default upload;
