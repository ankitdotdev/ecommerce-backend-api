import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import cloudinary from "../../config/cloudinary";

export const uploadToCloudinary = (
  buffer: Buffer,
  folder = "watersports",
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result as UploadApiResponse);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (
  imageUrl: string,
): Promise<boolean> => {
  if (!imageUrl) return false;

  const uploadIndex = imageUrl.indexOf("/upload/");

  if (uploadIndex === -1) {
    return false;
  }

  const pathAfterUpload = imageUrl.substring(uploadIndex + "/upload/".length);

  const publicId = pathAfterUpload
    .replace(/^v\d+\//, "")
    .replace(/\.[^/.]+$/, "");

  const result = await cloudinary.uploader.destroy(publicId);

  return result.result === "ok";
};
