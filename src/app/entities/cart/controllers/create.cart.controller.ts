import { TokenPayload } from "@/app/utils/jwt.utils";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { AddToCartRequest } from "../validators.cart";
import { db } from "@/lib/db";
import { cart, product_variations, products, users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

const handleCreateCart = async (
  req: Request<{}, {}, TokenPayload & AddToCartRequest>,
  res: Response
) => {
  try {
    const { productId, variationId } = req.body;
    const { id: userId } = req.body.token;

    const findUser = (
      await db.select().from(users).where(eq(users.id, userId)).limit(1)
    )[0];
    if (!findUser) {
      return res.status(404).send({
        description: "User not found",
        type: "error",
      });
    }

    const findProductVariation = (
      await db
        .select()
        .from(product_variations)
        .where(
          and(
            eq(product_variations.product_id, productId),
            eq(product_variations.id, variationId)
          )
        )
        .leftJoin(products, eq(products.id, productId))
        .limit(1)
    )[0];
    if (
      !findProductVariation?.product_variations ||
      !findProductVariation?.products
    ) {
      return res.status(404).send({
        description: "Product variation not found",
        type: "error",
      });
    }

    await db.insert(cart).values({
      id: uuid(),
      user_id: userId,
      product_id: productId,
      product_variation_id: variationId,
      quantity: 1,
    });

    res.status(200).send({
      title: "Added to cart",
      description: `Product "${findProductVariation.products.name}" added to your cart`,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle create cart error", err);
    res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleCreateCart;
