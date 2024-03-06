import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { wishlist } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleRemoveFromWishlist = async (
  req: Request<{ productId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const { id } = req.body.token;

    await db
      .delete(wishlist)
      .where(and(eq(wishlist.product_id, productId), eq(wishlist.user_id, id)));

    res.status(200).send();
  } catch (err) {
    Logger.error("handle remove from wishlist error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleRemoveFromWishlist;
