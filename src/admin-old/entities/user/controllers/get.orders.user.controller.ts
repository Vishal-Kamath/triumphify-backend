import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetUserOrders = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.user_id, userId));

    return res.status(200).send({
      data: userOrders,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get user orders error", err);
    return res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetUserOrders;
