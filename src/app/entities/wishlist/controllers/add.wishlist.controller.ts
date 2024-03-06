import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { products, users, wishlist } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleAddToWishlist = async (
  req: Request<{ productId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const { id } = req.body.token;

    const findProduct = (
      await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1)
    )[0];
    if (!findProduct) {
      return res.status(404).send({
        description: "product not found",
        type: "error",
      });
    }

    const findUser = (
      await db.select().from(users).where(eq(users.id, id)).limit(1)
    )[0];
    if (!findUser) {
      return res.status(404).send({
        description: "user not found",
        type: "error",
      });
    }

    const doesWishlistExist = (
      await db
        .select()
        .from(wishlist)
        .where(
          and(eq(wishlist.user_id, id), eq(wishlist.product_id, productId))
        )
        .limit(1)
    )[0];
    if (doesWishlistExist) {
      return res.status(400).send({
        description: "product exists in wishlist",
        type: "error",
      });
    }

    await db.insert(wishlist).values({
      user_id: findUser.id,
      product_id: findProduct.id,
    });

    res.status(200).send();
  } catch (err) {
    Logger.error("handle add to wishlist error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleAddToWishlist;
