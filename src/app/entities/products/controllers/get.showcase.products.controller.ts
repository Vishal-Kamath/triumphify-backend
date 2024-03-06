import { db } from "@/lib/db";
import { product_showcase, products } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { asc, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetProductShowcase = async (
  req: Request<{ slug: string }>,
  res: Response
) => {
  try {
    const { slug } = req.params;
    const showcases = await db
      .select({
        id: product_showcase.id,
        product_id: product_showcase.product_id,
        index: product_showcase.index,
        template: product_showcase.template,
        content: product_showcase.content,
        created_at: product_showcase.created_at,
        updated_at: product_showcase.updated_at,
      })
      .from(product_showcase)
      .leftJoin(products, eq(products.id, product_showcase.product_id))
      .where(eq(products.slug, slug))
      .orderBy(asc(product_showcase.created_at));

    res.status(200).send({ data: showcases, type: "success" });
  } catch (err) {
    Logger.error("handle get product showcase error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};
export default handleGetProductShowcase;
