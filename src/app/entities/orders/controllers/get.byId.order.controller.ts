import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { order_details, orders, tickets } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq, is } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetOrderById = async (
  req: Request<{ orderId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { orderId } = req.params;
    const { id } = req.body.token;
    const order = (
      await db
        .select()
        .from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.user_id, id)))
        .limit(1)
    )[0];

    if (!order) {
      return res
        .status(404)
        .send({ description: "Order not found", type: "error" });
    }

    const isCancelledRequested = (
      await db
        .select({
          id: tickets.id,
        })
        .from(tickets)
        .where(
          and(
            eq(tickets.user_id, id),
            eq(tickets.link, order.id),
            eq(tickets.type, "request"),
            eq(tickets.title, "Cancel Order Request")
          )
        )
        .limit(1)
    )[0];

    const ordersDetails = (
      await db
        .select()
        .from(order_details)
        .where(
          and(
            eq(order_details.id, order.group_id),
            eq(order_details.user_id, id)
          )
        )
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
      .where(and(eq(orders.group_id, order.group_id), eq(orders.user_id, id)));

    const data = {
      order,
      order_details: ordersDetails,
      all_orders: allOrders,
      isCancelledRequested:
        isCancelledRequested && isCancelledRequested?.id
          ? isCancelledRequested.id
          : false,
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

export default handleGetOrderById;
