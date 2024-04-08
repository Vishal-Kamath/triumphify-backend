import { db } from "@/lib/db";
import { categories, orders, products } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq, gte, lte, or, sum } from "drizzle-orm";
import { Request, Response } from "express";

const handelGetSalesByCategory = async (
  req: Request<
    {},
    {},
    {},
    { start: string; end: string; type: "history" | "cancelled" | "returned" }
  >,
  res: Response
) => {
  try {
    const end_date =
      req.query.end && !Number.isNaN(new Date(req.query.end).getTime())
        ? new Date(req.query.end)
        : undefined;
    const start_date =
      req.query.start && !Number.isNaN(new Date(req.query.start))
        ? new Date(req.query.start)
        : undefined;

    console.log(start_date);
    const type = req.query.type;
    const condition =
      type === "history"
        ? or(
            and(
              start_date ? gte(orders.created_at, start_date) : undefined,
              end_date ? lte(orders.created_at, end_date) : undefined,
              eq(orders.cancelled, false),
              eq(orders.returned, false)
            ),
            and(
              start_date ? gte(orders.created_at, start_date) : undefined,
              end_date ? lte(orders.created_at, end_date) : undefined,
              eq(orders.cancelled, true),
              eq(orders.returned, true)
            )
          )
        : type === "cancelled"
        ? and(
            start_date ? gte(orders.created_at, start_date) : undefined,
            end_date ? lte(orders.created_at, end_date) : undefined,
            eq(orders.cancelled, true),
            eq(orders.returned, false)
          )
        : and(
            start_date ? gte(orders.created_at, start_date) : undefined,
            end_date ? lte(orders.created_at, end_date) : undefined,
            eq(orders.cancelled, false),
            eq(orders.returned, true)
          );

    const sales = await db
      .select({
        category_id: categories.id,
        category_name: categories.name,
        total_units_sold: sum(orders.product_quantity),
        total_discounted_price: sum(
          orders.product_variation_discount_final_price
        ),
        total_sales: sum(orders.product_variation_final_price),
      })
      .from(orders)
      .where(condition)
      .leftJoin(products, eq(orders.product_id, products.id))
      .leftJoin(categories, eq(categories.id, products.category_id))
      .groupBy((data) => [data.category_id, data.category_name]);

    res.status(200).send({ data: sales, type: "success" });
  } catch (err) {
    Logger.error("handle get sales by category", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handelGetSalesByCategory;
