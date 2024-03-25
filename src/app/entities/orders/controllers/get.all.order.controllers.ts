import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, desc, eq, or } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllOrders = async (
  req: Request<
    { type: "history" | "cancelled" | "returned" },
    {},
    TokenPayload
  >,
  res: Response
) => {
  try {
    const { type } = req.params;
    const { id } = req.body.token;

    const condition =
      type === "history"
        ? or(
            and(
              eq(orders.user_id, id),
              eq(orders.cancelled, false),
              eq(orders.returned, false)
            ),
            and(
              eq(orders.user_id, id),
              eq(orders.cancelled, true),
              eq(orders.returned, true)
            )
          )
        : type === "cancelled"
        ? and(
            eq(orders.user_id, id),
            eq(orders.cancelled, true),
            eq(orders.returned, false)
          )
        : and(
            eq(orders.user_id, id),
            eq(orders.cancelled, false),
            eq(orders.returned, true)
          );

    const ordersList = await db
      .select()
      .from(orders)
      .where(condition)
      .orderBy(desc(orders.created_at));

    res.status(200).send({ data: ordersList, type: "success" });
  } catch (err) {
    Logger.error("handle get all orders error", err);
    return res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllOrders;
