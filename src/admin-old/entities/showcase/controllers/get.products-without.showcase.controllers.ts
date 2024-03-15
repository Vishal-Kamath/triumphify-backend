import { db } from "@/lib/db";
import { product_showcase, products } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq, is, notExists } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllProductsWithoutShowcase = async (
  req: Request,
  res: Response
) => {
  try {
    const productsWithoutShowcase = await db
      .select()
      .from(products)
      .where(
        notExists(
          db
            .select()
            .from(product_showcase)
            .where(eq(product_showcase.product_id, products.id))
        )
      );

    res.status(200).send({
      data: productsWithoutShowcase,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get all products without showcase", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllProductsWithoutShowcase;
