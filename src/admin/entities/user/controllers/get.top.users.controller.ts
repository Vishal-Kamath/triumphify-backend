import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { desc, eq, sum } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetTopUser = async (req: Request, res: Response) => {
  try {
    const top_users = await db
      .select({
        user_id: users.id,
        user_username: users.username,
        user_email: users.email,
        user_image: users.image,

        total_spent: sum(orders.product_variation_final_price),
      })
      .from(users)
      .leftJoin(orders, eq(orders.user_id, users.id))
      .groupBy((data) => [
        data.user_id,
        data.user_username,
        data.user_email,
        data.user_image,
      ])
      .orderBy((data) => desc(data.total_spent))
      .limit(10);

    res.status(200).send({
      data: top_users,
      type: "error",
    });
  } catch (err) {
    Logger.error("handle get top users", err);
    res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetTopUser;
