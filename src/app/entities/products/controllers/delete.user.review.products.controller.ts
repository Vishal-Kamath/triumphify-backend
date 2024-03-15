import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleDeleteUserReview = async (
  req: Request<{ productId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const { id } = req.body.token;

    await db
      .delete(reviews)
      .where(and(eq(reviews.user_id, id), eq(reviews.product_id, productId)));

    return res.status(200).send({
      title: "Review successfully deleted",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle create user product review error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleDeleteUserReview;
