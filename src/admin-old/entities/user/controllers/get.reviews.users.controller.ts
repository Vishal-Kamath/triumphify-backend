import { db } from "@/lib/db";
import { reviews, users } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetUserReviews = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const product_reviews = await db
      .select({
        id: reviews.id,
        user_username: users.username,
        user_image: users.image,
        product_id: reviews.product_id,
        rating: reviews.rating,
        review_title: reviews.review_title,
        review_description: reviews.review_description,
        status: reviews.status,

        created_at: reviews.created_at,
        updated_at: reviews.updated_at,
      })
      .from(reviews)
      .where(eq(reviews.user_id, userId))
      .leftJoin(users, eq(reviews.user_id, users.id));

    res.status(200).json({ data: product_reviews, type: "success" });
  } catch (err) {
    Logger.error("handle user reviews error", err);
    return res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleGetUserReviews;
