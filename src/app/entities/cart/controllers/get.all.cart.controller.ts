import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { cart, product_variations, products } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllCart = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;

    const carts = await db
      .select({
        id: cart.id,
        product: products,
        variation: product_variations,
        quantity: cart.quantity,
      })
      .from(cart)
      .where(eq(cart.user_id, id))
      .leftJoin(products, eq(products.id, cart.product_id))
      .leftJoin(
        product_variations,
        and(
          eq(product_variations.id, cart.product_variation_id),
          eq(product_variations.product_id, cart.product_id)
        )
      );

    res.status(200).send({
      data: carts,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get all cart");
    res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetAllCart;
