import { ConflictError } from "../../../utils/errors/AppError";
import { generateSlug } from "../../../utils/string/generateSlug";
import { IProduct, ProductStatus } from "../../products/products.interfaces";
import { Product } from "../../products/products.model";

class ProductService {
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
}
export default new ProductService();
