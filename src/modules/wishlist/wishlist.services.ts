import { BadRequestError, NotFoundError } from "../../utils/errors/AppError";
import { Product } from "../products/products.model";
import Wishlist from "./wishlist.model";

class WishlistServices {
  // ADD_TO_WISHLIST ____________________________________
  //
  // Edge Cases Covered:
  // - Product does not exist
  // - Product already in wishlist
  // - Wishlist does not exist
  // - Product is soft deleted (if applicable)

  async addToWishlist(userId: string, productId: string) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    let wishlist = await Wishlist.findOne({
      user: userId,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [product._id],
      });

      return wishlist;
    }

    const alreadyExists = wishlist.products.some(
      (id) => id.toString() === productId,
    );

    if (alreadyExists) {
      throw new BadRequestError("Product is already in your wishlist");
    }

    wishlist.products.push(product._id);

    await wishlist.save();

    return wishlist;
  }

  // GET_WISHLIST ____________________________________
  //
  // Edge Cases Covered:
  // - Wishlist does not exist
  // - Empty wishlist

  async getWishlist(userId: string) {
    const wishlist = await Wishlist.findOne({
      user: userId,
    }).populate({
      path: "products",
    });

    if (!wishlist) {
      return {
        products: [],
      };
    }

    return wishlist;
  }

  // REMOVE_FROM_WISHLIST ____________________________________
  //
  // Edge Cases Covered:
  // - Wishlist does not exist
  // - Product not present in wishlist
  // - Product already removed

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await Wishlist.findOne({
      user: userId,
    });

    if (!wishlist) {
      throw new NotFoundError("Wishlist not found");
    }

    const exists = wishlist.products.some((id) => id.toString() === productId);

    if (!exists) {
      throw new BadRequestError("Product is not in your wishlist");
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId,
    );

    await wishlist.save();

    return wishlist;
  }
  
  
  
  // CLEAR_WISHLIST ____________________________________
  //
  // Edge Cases Covered:
  // - Wishlist does not exist
  // - Wishlist already empty

  async clearWishlist(userId: string) {
    const wishlist = await Wishlist.findOne({
      user: userId,
    });

    if (!wishlist) {
      return {
        products: [],
      };
    }

    wishlist.products = [];

    await wishlist.save();

    return {
      products: [],
    };
  }
}

export default new WishlistServices();
