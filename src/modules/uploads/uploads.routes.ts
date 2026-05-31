import { Router } from "express";
import { upload } from "../../middleware/multer";
import uploadsController from "./uploads.controller";
import { multerErrorHandler } from "../../utils/errors/multerErrorHandler";
import validateRequest from "../../middleware/schemal.validator";
import { deleteImageValidationSchema } from "./uploads.schema";
import { authMiddleware } from "../../middleware/auth.middleware";

const uploadRouter = Router();

uploadRouter.use(authMiddleware.auth);
// UPLOAD_IMAGE ________________________________________________________________
/**
 * @swagger
 * /api/v1/upload:
 *   post:
 *     summary: Upload image
 *     description: Upload a single image to Cloudinary and return its URL and public ID.
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Image is required
 */
uploadRouter.post("/", upload.single("image"), uploadsController.uploadImage);

uploadRouter.use(multerErrorHandler);

// DELETE_IMAGE ________________________________________________________________
// Useful for cleaning up accidentally uploaded images before uploading the correct one.

/**
 * @swagger
 * /api/v1/upload:
 *   delete:
 *     summary: Delete image
 *     description: Delete a Cloudinary image using its URL.
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageUrl
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 description: Cloudinary image URL
 *                 example: https://res.cloudinary.com/dyrduh6wh/image/upload/v1780248490/products/o6zqwoovbsyd0y79lnus.png
 *     responses:
 *       200:
 *         description: Image deleted successfully
 */
uploadRouter.delete(
  "/",
  validateRequest(deleteImageValidationSchema),
  uploadsController.deleteImage,
);

export default uploadRouter;
