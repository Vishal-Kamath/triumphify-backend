import { db } from "@/lib/db";
import { orders, product_variations } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq, gte, lte, or, sum } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetVariationSales = async (
  req: Request<
    { productId: string },
    {},
    {},
    { start: string; end: string; type: "history" | "cancelled" | "returned" }
  >,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const end_date = req.query.end ? new Date(req.query.end) : new Date();
    const start_date = req.query.start
      ? new Date(req.query.start)
      : new Date(
          new Date(end_date).setMonth(new Date(end_date).getMonth() - 1)
        );

    const type = req.query.type;
    const condition =
      type === "history"
        ? or(
            and(
              eq(orders.product_id, productId),
              gte(orders.created_at, start_date),
              lte(orders.created_at, end_date),
              eq(orders.cancelled, false),
              eq(orders.returned, false)
            ),
            and(
              eq(orders.product_id, productId),
              gte(orders.created_at, start_date),
              lte(orders.created_at, end_date),
              eq(orders.cancelled, true),
              eq(orders.returned, true)
            )
          )
        : type === "cancelled"
        ? and(
            eq(orders.product_id, productId),
            gte(orders.created_at, start_date),
            lte(orders.created_at, end_date),
            eq(orders.cancelled, true),
            eq(orders.returned, false)
          )
        : and(
            eq(orders.product_id, productId),
            gte(orders.created_at, start_date),
            lte(orders.created_at, end_date),
            eq(orders.cancelled, false),
            eq(orders.returned, true)
          );

    const variation_sales = await db
      .select({
        // variation_key: product_variations.combinations,
        variation_key: orders.product_variation_combinations,
        total_units_sold: sum(orders.product_quantity),
        total_discounted_price: sum(
          orders.product_variation_discount_final_price
        ),
        total_sales: sum(orders.product_variation_final_price),
      })
      .from(orders)
      .where(condition)
      // .fullJoin(
      //   product_variations,
      //   eq(
      //     product_variations.combinations,
      //     orders.product_variation_combinations
      //   )
      // )
      .groupBy((data) => [data.variation_key]);
    console.log(variation_sales);
    return res.status(200).send({ data: variation_sales, type: "success" });
  } catch (err) {
    Logger.error("handle get variation sales", err);
    return res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetVariationSales;
