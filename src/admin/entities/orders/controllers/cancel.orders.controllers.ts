import { getRole } from "@/admin/utils/getRole";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { env } from "@/config/env.config";
import { db } from "@/lib/db";
import { orders, product_variations, users } from "@/lib/db/schema";
import { cancelOrderEmail } from "@/utils/courier/cancel-order";
import { CSVLogger } from "@/utils/csv.logger";
import { dateFormater } from "@/utils/dateFormater";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleCancelOrder = async (
  req: Request<{ orderId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { orderId } = req.params;
    const { id, role } = req.body.token;

    const findOrder = (
      await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
    )[0];

    if (!findOrder) {
      return res
        .status(404)
        .send({ description: "order not found", type: "error" });
    }

    const findProductVariation = (
      await db
        .select()
        .from(product_variations)
        .where(
          and(
            eq(product_variations.key, findOrder.product_variation_key),
            eq(product_variations.product_id, findOrder.product_id)
          )
        )
        .limit(1)
    )[0];

    if (!findProductVariation) {
      return res.status(404).send({
        description: "product variation not found",
        type: "error",
      });
    }

    const findUser = (
      await db
        .select()
        .from(users)
        .where(eq(users.id, findOrder.user_id))
        .limit(1)
    )[0];

    await db.transaction(async (trx) => {
      await trx
        .update(orders)
        .set({ cancelled: true })
        .where(eq(orders.id, orderId));

      await trx
        .update(product_variations)
        .set({
          quantity: findProductVariation.quantity + findOrder.product_quantity,
        })
        .where(
          and(
            eq(product_variations.key, findOrder.product_variation_key),
            eq(product_variations.product_id, findOrder.product_id)
          )
        );
    });

    CSVLogger.info(id, getRole(role), "cancelled order", orderId);

    if (findUser && findUser.email && findUser.username) {
      cancelOrderEmail({
        email: findUser.email,
        data: {
          userName: findUser.username,
          orderDate: dateFormater(findOrder.created_at),
          redirect: `${env.WEBSITE}/orders/details/${orderId}`,
        },
      });
    }

    res.status(200).send({
      title: "Cancelled",
      description: "order has been cancelled successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle cancel order error", err);
    return res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleCancelOrder;
