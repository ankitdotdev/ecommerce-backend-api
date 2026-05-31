import { Response } from "express";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const sendPaginatedResponse = <T>(
  res: Response,
  {
    statusCode = 200,
    message,
    data,
    meta,
  }: {
    statusCode?: number;
    message: string;
    data: T;
    meta: PaginationMeta;
  }
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    meta,
    data,
  });
};

export default sendPaginatedResponse;