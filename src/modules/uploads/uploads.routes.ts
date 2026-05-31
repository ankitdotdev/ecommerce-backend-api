import { Router } from "express";
import { upload } from "../../middleware/multer";
import uploadsController from "./uploads.controller";
import { multerErrorHandler } from "../../utils/errors/multerErrorHandler";

const uploadRouter = Router();

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

export default uploadRouter;
