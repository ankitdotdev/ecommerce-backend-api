export type ProductSort =
  | "price_asc"
  | "price_desc"
  | "newest"
  | "oldest";

export interface IProductQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  sort?: ProductSort;
}