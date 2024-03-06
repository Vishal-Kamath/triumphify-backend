import { db } from "@/lib/db";
import { product_showcase, products } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { count, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllProductShowcase = async (req: Request, res: Response) => {
  try {
    const showcases = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        brand_name: products.brand_name,
        gst_price: products.gst_price,
        product_images: products.product_images,
        showcases: count(product_showcase.id),

        created_at: products.created_at,
        updated_at: products.updated_at,
      })
      .from(products)
      .leftJoin(product_showcase, eq(product_showcase.product_id, products.id))
      .groupBy((data) => [data.id, data.name]);

    res.status(200).send({ data: showcases, type: "success" });
  } catch (err) {
    Logger.error("handle get product showcase error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};
export default handleGetAllProductShowcase;
