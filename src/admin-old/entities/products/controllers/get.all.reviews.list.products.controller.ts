import { db } from "@/lib/db";
import { products, reviews } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { avg, count, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllReviewsList = async (req: Request, res: Response) => {
  try {
    const product_reviews = await db
      .select({
        product_id: reviews.product_id,
        product_name: products.name,
        product_images: products.product_images,
        count: count(products.id),
        avg_rating: avg(reviews.rating),
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.product_id, products.id))
      .groupBy((data) => [data.product_id]);

    return res.status(200).send({ data: product_reviews, type: "success" });
  } catch (err) {
    Logger.error("handle get all reviews list error", err);
    return res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllReviewsList;
