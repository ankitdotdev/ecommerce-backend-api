export interface IProductQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "oldest";
}