import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import uploadsServices from "./uploads.services";

class UploadController {

  // UPLOAD_IMAGE ________________________________________________________________

  uploadImage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await uploadsServices.uploadImage(req.file);

        res.status(200).json({
          success: true,
          message: "Image uploaded successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // DELETE_IMAGE ________________________________________________________________

  deleteImage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await uploadsServices.deleteImage(req.body.imageUrl);

        res.status(200).json({
          success: true,
          message: "Image deleted successfully",
        });
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new UploadController();
