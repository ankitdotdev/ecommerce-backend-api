import { Router } from "express";

// Product APIs
// Method   Endpoint                              Description
//
// POST     /api/v1/admin/products                Create product
// GET      /api/v1/admin/products                Get all products
// GET      /api/v1/admin/products/:productId     Get single product
// PATCH    /api/v1/admin/products/:productId     Update product
// DELETE   /api/v1/admin/products/:productId     Soft delete product

const productRouter = Router();



export default productRouter;