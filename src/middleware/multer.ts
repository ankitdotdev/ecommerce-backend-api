import multer from "multer";

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const upload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only JPG, JPEG, PNG, and WEBP image formats are allowed.",
        ),
      );
    }

    cb(null, true);
  },

  limits: {
    // Current limit: 5MB
    // You can change this configuration based on your project requirements.
    fileSize: 5 * 1024 * 1024,
  },
});