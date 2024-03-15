import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, gte, lte, sum } from "drizzle-orm";
import { Request, Response } from "express";

const handleOrderAnalyticsList = async (
  req: Request<{}, {}, {}, { start: string; end: string }>,
  res: Response
) => {
  try {
    const end_date = req.query.end ? new Date(req.query.end) : new Date();
    const start_date = req.query.start
      ? new Date(req.query.start)
      : new Date(
          new Date(end_date).setMonth(new Date(end_date).getMonth() - 1)
        );
    const sales = await db
      .select({
        product_id: orders.product_id,
        product_name: orders.product_name,
        product_description: orders.product_description,
        product_image: orders.product_image,

        total_units_sold: sum(orders.product_quantity),
        total_discounted_price: sum(
          orders.product_variation_discount_final_price
        ),
        total_sales: sum(orders.product_variation_final_price),
      })
      .from(orders)
      .where(
        and(
          gte(orders.created_at, start_date),
          lte(orders.created_at, end_date)
        )
      )
      .groupBy((data) => [
        data.product_id,
        data.product_name,
        data.product_description,
        data.product_image,
      ]);

    res.status(200).send({ data: sales, type: "success" });
  } catch (err) {
    Logger.error("handle order analytics list error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleOrderAnalyticsList;

/*
product_name
product_id
product_images
product_decription

total_units_sold
total_sales
*/
