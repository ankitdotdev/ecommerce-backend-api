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
