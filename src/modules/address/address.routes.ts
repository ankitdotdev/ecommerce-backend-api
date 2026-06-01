// GET    /api/v1/addresses
// POST   /api/v1/addresses
// GET    /api/v1/addresses/:addressId
// PATCH  /api/v1/addresses/:addressId
// DELETE /api/v1/addresses/:addressId
import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/schemal.validator";

import addressController from "./address.controller";

import {
  createAddressValidationSchema,
  updateAddressValidationSchema,
  addressParamsValidationSchema,
} from "./address.schema";

const addressRouter = Router();

addressRouter.use(authMiddleware.auth);
addressRouter.use(authMiddleware.customer);

// GET_ADDRESSES ________________________________________________________________

/**
 * @swagger
 * /api/v1/addresses:
 *   get:
 *     summary: Get user addresses
 *     description: Retrieve all addresses for the authenticated user.
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 */
addressRouter.get("/", addressController.getAddresses);

// CREATE_ADDRESS ________________________________________________________________

/**
 * @swagger
 * /api/v1/addresses:
 *   post:
 *     summary: Create address
 *     description: Create a new shipping address for the authenticated user.
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressLine1
 *               - city
 *               - state
 *               - country
 *               - postalCode
 *             properties:
 *               addressLine1:
 *                 type: string
 *                 example: Flat 301, Green Heights Apartment
 *               addressLine2:
 *                 type: string
 *                 example: Near City Mall
 *               landmark:
 *                 type: string
 *                 example: Opposite Central Park
 *               city:
 *                 type: string
 *                 example: Mumbai
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *               country:
 *                 type: string
 *                 example: India
 *               postalCode:
 *                 type: string
 *                 example: "400001"
 *               latitude:
 *                 type: number
 *                 example: 19.076
 *               longitude:
 *                 type: number
 *                 example: 72.8777
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
addressRouter.post(
  "/",
  validateRequest(createAddressValidationSchema),
  addressController.createAddress,
);

// GET_ADDRESS ________________________________________________________________

/**
 * @swagger
 * /api/v1/addresses/{addressId}:
 *   get:
 *     summary: Get address
 *     description: Retrieve a single address belonging to the authenticated user.
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 */
addressRouter.get(
  "/:addressId",
  validateRequest(addressParamsValidationSchema),
  addressController.getAddress,
);

// UPDATE_ADDRESS ________________________________________________________________

/**
 * @swagger
 * /api/v1/addresses/{addressId}:
 *   patch:
 *     summary: Update address
 *     description: Update an existing address belonging to the authenticated user.
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         description: Address ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressLine1:
 *                 type: string
 *                 example: Flat 402, Blue Sky Residency
 *               addressLine2:
 *                 type: string
 *                 example: Near Infinity Mall
 *               landmark:
 *                 type: string
 *                 example: Opposite Metro Station
 *               city:
 *                 type: string
 *                 example: Mumbai
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *               country:
 *                 type: string
 *                 example: India
 *               postalCode:
 *                 type: string
 *                 example: "400053"
 *               latitude:
 *                 type: number
 *                 example: 19.1197
 *               longitude:
 *                 type: number
 *                 example: 72.8468
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
addressRouter.patch(
  "/:addressId",
  validateRequest(addressParamsValidationSchema),
  validateRequest(updateAddressValidationSchema),
  addressController.updateAddress,
);

// DELETE_ADDRESS ________________________________________________________________

/**
 * @swagger
 * /api/v1/addresses/{addressId}:
 *   delete:
 *     summary: Delete address
 *     description: Delete an address belonging to the authenticated user.
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 */
addressRouter.delete(
  "/:addressId",
  validateRequest(addressParamsValidationSchema),
  addressController.deleteAddress,
);

export default addressRouter;
