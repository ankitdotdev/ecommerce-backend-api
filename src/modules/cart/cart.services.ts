import { BadRequestError, NotFoundError } from "../../utils/errors/AppError";
import { Product } from "../products/products.model";
import { ProductStatus } from "../products/products.interfaces";
import { Cart } from "./cart.module";

class CartServices {
  // GET_CART ____________________________________
  //
  // Edge Cases Covered:
  // - Cart does not exist
  // - Deleted products in cart
  // - Inactive products in cart

  async getCart(userId: string) {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      match: {
        isDeleted: false,
        status: ProductStatus.ACTIVE,
      },
      select: "name slug price images stock",
    });

    if (!cart) {
      return {
        items: [],
      };
    }

    // Remove products that were deleted/inactivated after being added to cart
    const validItems = cart.items.filter((item: any) => item.product);

    return {
      ...cart.toObject(),
      items: validItems,
    };
  }

  // ADD_TO_CART ____________________________________
  //
  // Edge Cases Covered:
  // - Product does not exist
  // - Product is inactive
  // - Product is deleted
  // - Requested quantity exceeds stock
  // - Product already exists in cart
  // - Cart does not exist for user
  // - Maximum cart item limit reached

  async addToCart(
    userId: string,
    payload: {
      productId: string;
      quantity: number;
    },
  ) {
    const product = await Product.findOne({
      _id: payload.productId,
      isDeleted: false,
      status: ProductStatus.ACTIVE,
    });

    if (!product) {
      throw new NotFoundError("Product not found or is no longer available");
    }

    if (payload.quantity > product.stock) {
      throw new BadRequestError(
        `Only ${product.stock} item(s) available in stock`,
      );
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === payload.productId,
    );

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + payload.quantity;

      if (updatedQuantity > product.stock) {
        throw new BadRequestError(
          `Only ${product.stock} item(s) available in stock`,
        );
      }

      existingItem.quantity = updatedQuantity;
    } else {
      const MAX_CART_ITEMS = 50;

      if (cart.items.length >= MAX_CART_ITEMS) {
        throw new BadRequestError(
          `You can only add up to ${MAX_CART_ITEMS} products to your cart`,
        );
      }

      cart.items.push({
        product: product._id,
        quantity: payload.quantity,
      });
    }

    await cart.save();

    return cart;
  }

  // UPDATE_CART_ITEM ____________________________________
  //
  // Edge Cases Covered:
  // - Cart does not exist
  // - Product does not exist in cart
  // - Product is inactive
  // - Product is deleted
  // - Requested quantity exceeds stock

  async updateCartItem(userId: string, productId: string, quantity: number) {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
      status: ProductStatus.ACTIVE,
    });

    if (!product) {
      throw new NotFoundError("Product not found or is no longer available");
    }

    if (quantity > product.stock) {
      throw new BadRequestError(
        `Only ${product.stock} item(s) available in stock`,
      );
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartItem) {
      throw new NotFoundError("Product not found in cart");
    }

    cartItem.quantity = quantity;

    await cart.save();

    return cart;
  }

  // REMOVE_CART_ITEM ____________________________________
  //
  // Edge Cases Covered:
  // - Cart does not exist
  // - Product does not exist in cart

  async removeCartItem(userId: string, productId: string) {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId,
    );

    if (!itemExists) {
      throw new NotFoundError("Product not found in cart");
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    return cart;
  }

  // CLEAR_CART ____________________________________
  //
  // Edge Cases Covered:
  // - Cart does not exist
  // - Cart already empty

  async clearCart(userId: string) {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return null;
    }

    cart.items = [];

    await cart.save();

    return cart;
  }
}

export default new CartServices();
