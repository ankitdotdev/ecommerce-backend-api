import { NotFoundError } from "../../utils/errors/AppError";
import { ProductStatus } from "./products.interfaces";
import { Product } from "./products.model";
import { IProductQuery } from "./products.types";

class ProductServices {
  // GET_ALL_PRODUCTS ____________________________________

  async getAllProducts(query: IProductQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      isDeleted: false,
      status: ProductStatus.ACTIVE,
    };

    if (query.search?.trim()) {
      filter.name = {
        $regex: query.search.trim(),
        $options: "i",
      };
    }

    if (query.category?.trim()) {
      filter.category = query.category.trim();
    }

    console.log("The query is", filter);

    let mongoQuery = Product.find(filter);

    switch (query.sort) {
      case "price_asc":
        mongoQuery = mongoQuery.sort({ price: 1 });
        break;

      case "price_desc":
        mongoQuery = mongoQuery.sort({ price: -1 });
        break;

      case "oldest":
        mongoQuery = mongoQuery.sort({ createdAt: 1 });
        break;

      default:
        mongoQuery = mongoQuery.sort({ createdAt: -1 });
        break;
    }

    const [products, total] = await Promise.all([
      mongoQuery.skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: products,
    };
  }
  // GET_PRODUCT_DETAILS ____________________________________

  async getProductDetails(slug: string) {
    const product = await Product.findOne({
      slug,
      isDeleted: false,
      status: ProductStatus.ACTIVE,
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }
}

export default new ProductServices();
