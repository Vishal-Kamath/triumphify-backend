import { db } from "@/lib/db";
import { categories, orders, products } from "@/lib/db/schema";
import { convertUTCDateToLocalDate } from "@/utils/getUTCDate";
import { Logger } from "@/utils/logger";
import { SQL, and, eq, gte, lte, or, sum } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetSales = async (
  req: Request<
    { categoryId: string },
    {},
    {},
    { month: number; year: number; type: "history" | "cancelled" | "returned" }
  >,
  res: Response
) => {
  try {
    const month = req.query.month || new Date().getMonth();
    const year = req.query.year || new Date().getFullYear();

    const start_date = new Date(year, month, 1);
    const end_date = new Date(year, Number(month) + 1, 1);

    const previous_start_date = new Date(year, month - 1, 1);

    const type = req.query.type;
    const condition = getCondition(start_date, end_date, type);
    const previousMonthCondition = getCondition(
      previous_start_date,
      start_date,
      type
    );

    const sales = await getSales(condition);

    const sales_total = await getTotalSales(condition);
    const previous_sales_total = await getTotalSales(previousMonthCondition);

    res.status(200).send({
      data: { sales, sales_total, previous_sales_total },
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get sales", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetSales;

const getCondition = (
  start_date: Date,
  end_date: Date,
  type: "history" | "cancelled" | "returned"
) => {
  return type === "history"
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
};

const getSales = async (condition: SQL<unknown> | undefined) => {
  const getAllcategories = (await db.select().from(categories)).map(
    (category) => ({
      category_id: category.id,
      category_name: category.name,
      total_units_sold: 0,
      total_discounted_price: 0,
      total_sales: 0,
    })
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
    .groupBy((data) => [data.category_id, data.category_name])
    .leftJoin(products, eq(orders.product_id, products.id))
    .leftJoin(categories, eq(categories.id, products.category_id))
    .where(condition);

  getAllcategories.forEach((category) => {
    const findSale = sales.find(
      (sale) => sale.category_id === category.category_id
    );
    if (!findSale) return;

    category.total_units_sold = Number(findSale.total_units_sold);
    category.total_discounted_price = Number(findSale.total_discounted_price);
    category.total_sales = Number(findSale.total_sales);
  });

  return getAllcategories;
};

const getTotalSales = async (condition: SQL<unknown> | undefined) => {
  return (
    await db
      .select({
        total_units_sold: sum(orders.product_quantity),
        total_discounted_price: sum(
          orders.product_variation_discount_final_price
        ),
        total_sales: sum(orders.product_variation_final_price),
      })
      .from(orders)
      .where(condition)
  ).map((sale) => ({
    total_units_sold: Number(Number(sale.total_units_sold).toFixed(2)),
    total_discounted_price: Number(
      Number(sale.total_discounted_price).toFixed(2)
    ),
    total_sales: Number(
      (Number(sale.total_sales) + Number(sale.total_discounted_price)).toFixed(
        2
      )
    ),
    total_revenue: Number(Number(sale.total_sales).toFixed(2)),
  }))[0];
};
