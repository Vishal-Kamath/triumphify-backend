import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handeGetByIdUserReview = async (
  req: Request<{ productId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const { id } = req.body.token;

    const getReview = (
      await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.user_id, id), eq(reviews.product_id, productId)))
        .limit(1)
    )[0];
    if (!getReview) {
      return res
        .status(400)
        .json({ description: "review doesn't exists", type: "error" });
    }

    return res.status(200).json({ data: getReview, type: "error" });
  } catch (err) {
    Logger.error("handle get review by id", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handeGetByIdUserReview;
