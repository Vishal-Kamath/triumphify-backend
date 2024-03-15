import { TokenPayload } from "@/app/utils/jwt.utils";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqUserReview } from "../validators.products";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export const handleUpdateUserProductReview = async (
  req: Request<{ productId: string }, {}, TokenPayload & ReqUserReview>,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const { id } = req.body.token;
    const { review_title, review_description, rating } = req.body;

    // check review exists
    const reviewExists = (
      await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.user_id, id), eq(reviews.product_id, productId)))
        .limit(1)
    )[0];

    if (!reviewExists) {
      return res
        .status(400)
        .send({ description: "review doesn't exists", type: "error" });
    }

    // update review
    await db
      .update(reviews)
      .set({
        review_title,
        review_description,
        rating,
        pinned: true,
        status: "pending",
      })
      .where(and(eq(reviews.user_id, id), eq(reviews.product_id, productId)));

    res.status(200).send({
      title: "Review successfully updated",
      description:
        "Thank you for updating your review, we appretiate your feedback!",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle create user product review error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleUpdateUserProductReview;
