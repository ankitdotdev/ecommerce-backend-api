import { ConflictError } from "../../../utils/errors/AppError";
import { generateSlug } from "../../../utils/string/generateSlug";
import { IProduct, ProductStatus } from "../../products/products.interfaces";
import { Product } from "../../products/products.model";
import { IProductQuery } from "./products.types";

class ProductService {
  // CREATE_PRODUCT ____________________________________

  async createProduct(payload: Partial<IProduct>, userId: string) {
    const slug = generateSlug(payload.name!);

    const existingProduct = await Product.findOne({
      slug,
      isDeleted: false,
    });

    if (existingProduct) {
      throw new ConflictError("A product with this name already exists.");
    }

    const product = await Product.create({
      ...payload,
      slug,
      createdBy: userId,
      status: ProductStatus.DRAFT,
      isDeleted: false,
    });

    return product;
  }

  // GET_ALL_PRODUCTS ___________________________________

  async getAllProducts(query: IProductQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      isDeleted: false,
    };

    // Status Filter
    if (query.status) {
      filter.status = query.status.toUpperCase();
    }

    // Search
    if (query.search?.trim()) {
      filter.name = {
        $regex: query.search.trim(),
        $options: "i",
      };
    }

    let mongoQuery = Product.find(filter).populate("createdBy", "name email");

    // Sorting
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

    console.log("Query form is ", mongoQuery);

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
}
export default new ProductService();
