import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleUserReviewsPinned = async (
  req: Request<{ reviewId: string }, {}, { pinned: boolean }>,
  res: Response
) => {
  try {
    const { reviewId } = req.params;
    const { pinned } = req.body;

    const findReview = (
      await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1)
    )[0];
    if (!findReview) {
      return res.status(404).send({
        description: "Review not found",
        type: "error",
      });
    }

    await db
      .update(reviews)
      .set({
        pinned,
      })
      .where(eq(reviews.id, reviewId));

    return res.status(200).send();
  } catch (err) {
    Logger.error("handle user review pinned error", err);
    res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleUserReviewsPinned;
