import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { cart } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleRemoveCartItem = async (
  req: Request<{ cartId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { cartId } = req.params;
    const { id } = req.body.token;
    await db.delete(cart).where(and(eq(cart.id, cartId), eq(cart.user_id, id)));

    res.status(200).send({
      title: "Success",
      description: "Cart item successfully deleted",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle remove from cart error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleRemoveCartItem;
