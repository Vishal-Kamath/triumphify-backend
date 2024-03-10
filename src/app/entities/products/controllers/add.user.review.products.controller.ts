import { TokenPayload } from "@/app/utils/jwt.utils";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqUserReview } from "../validators.products";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

const handleCreateUserProductReview = async (
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
    if (reviewExists) {
      return res
        .status(400)
        .json({ description: "review already exists", type: "error" });
    }

    // create review
    await db.insert(reviews).values({
      user_id: id,
      product_id: productId,
      review_title,
      review_description,
      rating,
    });

    res.status(201).json({
      title: "Review successfully sent",
      description:
        "Thank you for leaving a review, we appretiate your feedback!",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle create user product review error", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleCreateUserProductReview;
