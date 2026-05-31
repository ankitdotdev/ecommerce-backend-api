import { BadRequestError } from "../../utils/errors/AppError";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/upload/cloudinary";

class UploadServices {
  // UPLOAD_IMAGE ________________________________________________________________

  async uploadImage(file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestError("Image is required");
    }

    const uploadedImage = await uploadToCloudinary(file.buffer, "products");

    return {
      publicId: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    };
  }

  // DELETE_IMAGE ________________________________________________________________

  async deleteImage(imageUrl: string) {
    const deleted = await deleteFromCloudinary(imageUrl);

    if (!deleted) {
      throw new Error("Failed to delete image");
    }

    return null;
  }
}

export default new UploadServices();
