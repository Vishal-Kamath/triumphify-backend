import { z, AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { Logger } from "@/utils/logger";

export const blankSchema = z.object({});
const validateResources =
  (
    paramsSchema: AnyZodObject,
    bodySchema: AnyZodObject,
    querySchema: AnyZodObject
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    const schema = z.object({
      params: paramsSchema,
      body: bodySchema,
      query: querySchema,
    });

    try {
      schema.parse({
        params: req.params,
        body: req.body,
        query: req.query,
      });

      return next();
    } catch (err: any) {
      Logger.error("validate resources error:", err);
      return res.status(400).send(err);
    }
  };

export default validateResources;
