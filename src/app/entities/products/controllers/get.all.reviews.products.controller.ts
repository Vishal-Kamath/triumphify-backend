import { db } from "@/lib/db";
import { reviews, users } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllReviews = async (
  req: Request<{ productId: string }>,
  res: Response
) => {
  try {
    const { productId } = req.params;

    const product_reviews = (
      await db
        .select({
          id: reviews.id,
          user_username: users.username,
          user_image: users.image,
          product_id: reviews.product_id,
          rating: reviews.rating,
          review_title: reviews.review_title,
          review_description: reviews.review_description,

          created_at: reviews.created_at,
          updated_at: reviews.updated_at,
        })
        .from(reviews)
        .where(
          and(eq(reviews.product_id, productId), eq(reviews.status, "approved"))
        )
        .leftJoin(users, eq(reviews.user_id, users.id))
    ).sort((a, b) => b.rating - a.rating);

    return res.status(200).json({ data: product_reviews, type: "success" });
  } catch (err) {
    Logger.error("handle get all reviews", err);
    return res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllReviews;
