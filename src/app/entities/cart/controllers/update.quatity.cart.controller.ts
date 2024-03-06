import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { cart } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleUpdateQuantityCart = async (
  req: Request<{ cartId: string }, {}, TokenPayload & { quantity: number }>,
  res: Response
) => {
  try {
    const { cartId } = req.params;
    const { quantity, token } = req.body;

    if (quantity <= 0) {
      return res.status(400).send({
        description: "Invalid request",
        type: "error",
      });
    }

    await db
      .update(cart)
      .set({
        quantity,
      })
      .where(and(eq(cart.id, cartId), eq(cart.user_id, token.id)));

    return res.status(200).send();
  } catch (err) {
    Logger.error("handle update quantity cart error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleUpdateQuantityCart;
