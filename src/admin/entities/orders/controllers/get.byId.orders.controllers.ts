import { db } from "@/lib/db";
import { order_details, orders } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetByIdOrdersControllers = async (
  req: Request<{ orderId: string }>,
  res: Response
) => {
  try {
    const { orderId } = req.params;
    const order = (
      await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
    )[0];

    if (!order) {
      return res
        .status(404)
        .send({ description: "Order not found", type: "error" });
    }

    const ordersDetails = (
      await db
        .select()
        .from(order_details)
        .where(eq(order_details.id, order.group_id))
        .limit(1)
    )[0];

    if (!ordersDetails) {
      return res
        .status(404)
        .send({ description: "Order not found", type: "error" });
    }

    const allOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.group_id, order.group_id));

    const data = {
      order,
      order_details: ordersDetails,
      all_orders: allOrders,
    };

    res.status(200).send({
      data,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get all orders error", err);
    return res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetByIdOrdersControllers;
