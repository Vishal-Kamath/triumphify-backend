import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { orders, tickets } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { RequestCancelReturn } from "../validators.orders";

const handleCancelOrderRequest = async (
  req: Request<{ orderId: string }, {}, RequestCancelReturn & TokenPayload>,
  res: Response
) => {
  try {
    const { orderId } = req.params;
    const { id } = req.body.token;
    const { reason } = req.body;

    const findOrder = (
      await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
    )[0];
    if (!findOrder) {
      return res
        .status(404)
        .send({ description: "order not found", type: "error" });
    }

    await db.insert(tickets).values({
      id: uuid(),
      user_id: id,
      link: orderId,
      title: "Cancel Order Request",
      description: reason,
      type: "request",
      status: "pending",
    });

    return res.status(200).send({
      title: "Request sent successfully",
      description: "cancel request sent successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle cancel order request error", err);
    return res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleCancelOrderRequest;
