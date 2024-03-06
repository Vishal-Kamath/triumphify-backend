import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetProductMeta = async (
  req: Request<{ slug: string }>,
  res: Response
) => {
  try {
    const { slug } = req.params;
    const product_meta = (
      await db
        .select({
          meta_title: products.meta_title,
          meta_description: products.meta_description,
          meta_keywords: products.meta_keywords,
        })
        .from(products)
        .where(eq(products.slug, slug))
        .limit(1)
    )[0];

    if (!product_meta) {
      return res
        .status(404)
        .send({ description: "Product not found", type: "error" });
    }

    res.status(200).send({
      data: product_meta,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get product meta error", err);
    res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleGetProductMeta;
