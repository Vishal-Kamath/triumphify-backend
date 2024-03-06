import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { products, wishlist } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllWishlist = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;
    const wishlists = await db
      .select({
        product: products,
      })
      .from(wishlist)
      .where(eq(wishlist.user_id, id))
      .leftJoin(products, eq(wishlist.product_id, products.id));

    const filtered = wishlists
      .map((list) => list.product)
      .filter((product) => !!product);

    res.status(200).send({
      data: filtered,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get all wishlist error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllWishlist;
