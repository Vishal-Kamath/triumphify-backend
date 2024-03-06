import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllOrders = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;

    const ordersList = await db
      .select()
      .from(orders)
      .where(eq(orders.user_id, id));

    res.status(200).send({ data: ordersList, type: "success" });
  } catch (err) {
    Logger.error("handle get all orders error", err);
    return res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllOrders;
