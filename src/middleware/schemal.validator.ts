import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validateRequest =
  (schema: z.ZodType) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {

      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();

    } catch (error) {
      next(error);
    }
  };

export default validateRequest;