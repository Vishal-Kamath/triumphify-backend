import { TokenPayload } from "@/admin/utils/jwt.utils";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { OrderStatus } from "../validators.orders";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CSVLogger } from "@/utils/csv.logger";
import { getRole } from "@/admin/utils/getRole";

const handleUpdateOrderStatus = async (
  req: Request<{ orderId: string }, {}, OrderStatus & TokenPayload>,
  res: Response
) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const { id, role } = req.body.token;

    const order = (
      await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
    )[0];
    if (!order) {
      return res.status(404).send({
        description: "order not found",
        type: "error",
      });
    }

    await db.update(orders).set({ status }).where(eq(orders.id, orderId));

    CSVLogger.info(
      id,
      getRole(role),
      "update order status",
      JSON.stringify({ orderId, status })
    );
    return res.status(200).send({
      title: "Succes",
      description: `Order status updated to "${status}"`,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle update order status", err);
    return res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleUpdateOrderStatus;
