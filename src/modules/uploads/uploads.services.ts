import { Express } from "express";

import { BadRequestError } from "../../utils/errors/AppError";
import { uploadToCloudinary } from "../../utils/upload/cloudinary";

class UploadServices {
  async uploadImage(file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestError("Image is required");
    }

    const uploadedImage = await uploadToCloudinary(
      file.buffer,
      "products",
    );

    return {
      publicId: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    };
  }
}

export default new UploadServices();