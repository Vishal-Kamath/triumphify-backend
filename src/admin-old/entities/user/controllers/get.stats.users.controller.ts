import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, count, eq, or, sum } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetUserStats = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const user_stats = (
      await db
        .select({
          total_orders_placed: count(orders.id),
          total_amount_spent: sum(orders.product_variation_final_price),
        })
        .from(users)
        .where(eq(users.id, userId))
        .leftJoin(orders, eq(orders.user_id, users.id))
        .limit(1)
    )[0];

    const total_orders_price = (
      await db
        .select({
          total_orders_price: sum(orders.product_variation_final_price),
        })
        .from(orders)
        .where(
          or(
            and(
              eq(orders.user_id, userId),
              eq(orders.cancelled, false),
              eq(orders.returned, false)
            ),
            and(
              eq(orders.user_id, userId),
              eq(orders.cancelled, true),
              eq(orders.returned, true)
            )
          )
        )
        .limit(1)
    )[0];

    const total_cancelled_orders_price = (
      await db
        .select({
          total_cancelled_orders_price: sum(
            orders.product_variation_final_price
          ),
        })
        .from(orders)
        .where(
          and(
            eq(orders.user_id, userId),
            eq(orders.cancelled, true),
            eq(orders.returned, false)
          )
        )
        .limit(1)
    )[0];

    const total_returned_orders_price = (
      await db
        .select({
          total_returned_orders_price: sum(
            orders.product_variation_final_price
          ),
        })
        .from(orders)
        .where(
          and(
            eq(orders.user_id, userId),
            eq(orders.cancelled, false),
            eq(orders.returned, true)
          )
        )
        .limit(1)
    )[0];

    const data = {
      ...user_stats,
      ...total_orders_price,
      ...total_cancelled_orders_price,
      ...total_returned_orders_price,
    };

    res.status(200).send({ data, type: "success" });
  } catch (err) {
    Logger.error("handle get user stats error", err);
    return res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetUserStats;
