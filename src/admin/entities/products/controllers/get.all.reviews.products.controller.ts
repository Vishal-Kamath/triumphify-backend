import { db } from "@/lib/db";
import { reviews, users } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq, gte, lte } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllReviews = async (
  req: Request<{ productId: string }, {}, {}, { start: string; end: string }>,
  res: Response
) => {
  try {
    const { productId } = req.params;

    const start_date = new Date(req.query.start);
    const end_date = new Date(req.query.end);
    const all_reviews = await db
      .select({
        id: reviews.id,
        pinned: reviews.pinned,
        user_id: reviews.user_id,
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
      .where(
        and(
          eq(reviews.product_id, productId),
          gte(reviews.created_at, start_date),
          lte(reviews.created_at, end_date)
        )
      )
      .leftJoin(users, eq(reviews.user_id, users.id));

    return res.status(200).send({
      data: all_reviews,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get all reviews error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllReviews;
