import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { desc } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllOrders = async (req: Request, res: Response) => {
  try {
    const ordersList = await db
      .select()
      .from(orders)
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
