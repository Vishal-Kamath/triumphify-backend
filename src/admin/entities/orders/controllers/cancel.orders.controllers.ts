import { getRole } from "@/admin/utils/getRole";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { env } from "@/config/env.config";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { cancelOrderEmail } from "@/utils/courier/cancel-order";
import { CSVLogger } from "@/utils/csv.logger";
import { dateFormater } from "@/utils/dateFormater";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
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

    const findUser = (
      await db
        .select()
        .from(users)
        .where(eq(users.id, findOrder.user_id))
        .limit(1)
    )[0];

    await db
      .update(orders)
      .set({ cancelled: true })
      .where(eq(orders.id, orderId));

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
