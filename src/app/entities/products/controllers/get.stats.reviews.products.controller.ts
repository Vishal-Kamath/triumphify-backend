import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, avg, count, countDistinct, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetReviewStats = async (
  req: Request<{ productId: string }>,
  res: Response
) => {
  try {
    const { productId } = req.params;

    const unrefinedRatings = await db
      .selectDistinct({
        rating: reviews.rating,
        count: countDistinct(reviews.rating),
      })
      .from(reviews)
      .where(
        and(eq(reviews.product_id, productId), eq(reviews.status, "approved"))
      )
      .groupBy((data) => [reviews.rating]);

    const ratings = [5, 4, 3, 2, 1].map((rating) => {
      const found = unrefinedRatings.find((r) => r.rating === rating);
      return {
        rating,
        count: found ? found.count : 0,
      };
    });

    const stats = (
      await db
        .select({
          total_reviews: count(reviews.rating),
          average_rating: avg(reviews.rating),
        })
        .from(reviews)
        .where(
          and(eq(reviews.product_id, productId), eq(reviews.status, "approved"))
        )
    )[0];

    const data = {
      total_reviews: stats.total_reviews,
      average_rating: Number(stats.average_rating) || 0,
      ratings,
    };

    return res.status(200).json({ data, type: "success" });
  } catch (err) {
    Logger.error("handle get review stats", err);
    return res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleGetReviewStats;
