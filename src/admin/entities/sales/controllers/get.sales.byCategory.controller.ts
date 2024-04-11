import { db } from "@/lib/db";
import { categories, orders, products } from "@/lib/db/schema";
import { convertUTCDateToLocalDate } from "@/utils/getUTCDate";
import { Logger } from "@/utils/logger";
import { SQL, and, eq, gte, lte, or, sum } from "drizzle-orm";
import { Request, Response } from "express";

const handelGetSalesByCategory = async (
  req: Request<
    { categoryId: string },
    {},
    {},
    { month: number; year: number; type: "history" | "cancelled" | "returned" }
  >,
  res: Response
) => {
  try {
    const { categoryId } = req.params;
    const getCategory = (
      await db.select().from(categories).where(eq(categories.id, categoryId))
    )[0];
    if (!getCategory) {
      res
        .status(404)
        .send({ data: [], description: "category not found", type: "error" });
      return;
    }

    const month = req.query.month || new Date().getMonth();
    const year = req.query.year || new Date().getFullYear();

    const start_date = new Date(year, month, 1);
    const end_date = new Date(year, Number(month) + 1, 1);

    const previous_start_date = new Date(year, month - 1, 1);

    const type = req.query.type;
    const condition = getCondition(categoryId, start_date, end_date, type);
    const previousMonthCondition = getCondition(
      categoryId,
      previous_start_date,
      start_date,
      type
    );

    const sales = await getSales(
      condition,
      month,
      year,
      categoryId,
      getCategory.name
    );

    const sales_total = await getTotalSales(condition);
    const previous_sales_total = await getTotalSales(previousMonthCondition);

    res.status(200).send({
      data: { sales, sales_total, previous_sales_total },
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get sales by category", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handelGetSalesByCategory;

const getCondition = (
  categoryId: string,
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
          eq(orders.returned, false),
          eq(categories.id, categoryId)
        ),
        and(
          start_date ? gte(orders.created_at, start_date) : undefined,
          end_date ? lte(orders.created_at, end_date) : undefined,
          eq(orders.cancelled, true),
          eq(orders.returned, true),
          eq(categories.id, categoryId)
        )
      )
    : type === "cancelled"
    ? and(
        start_date ? gte(orders.created_at, start_date) : undefined,
        end_date ? lte(orders.created_at, end_date) : undefined,
        eq(orders.cancelled, true),
        eq(orders.returned, false),
        eq(categories.id, categoryId)
      )
    : and(
        start_date ? gte(orders.created_at, start_date) : undefined,
        end_date ? lte(orders.created_at, end_date) : undefined,
        eq(orders.cancelled, false),
        eq(orders.returned, true),
        eq(categories.id, categoryId)
      );
};

const getSales = async (
  condition: SQL<unknown> | undefined,
  month: number,
  year: number,
  categoryId: string,
  categoryName: string
) => {
  const sales = (
    await db
      .select({
        created_date: orders.created_date,
        total_units_sold: sum(orders.product_quantity),
        total_discounted_price: sum(
          orders.product_variation_discount_final_price
        ),
        total_sales: sum(orders.product_variation_final_price),
      })
      .from(orders)
      .leftJoin(products, eq(orders.product_id, products.id))
      .leftJoin(categories, eq(categories.id, products.category_id))
      .where(condition)
      .groupBy((data) => [data.created_date])
  ).map((sale) => ({
    created_date: sale.created_date,
    total_units_sold: Number(sale.total_units_sold),
    total_discounted_price: Number(sale.total_discounted_price),
    total_sales: Number(sale.total_sales),
  }));

  const dates = Array(Number(new Date(year, Number(month) + 1, 0).getDate()))
    .fill(0)
    .map((_, i) => ({
      category_id: categoryId,
      category_name: categoryName,
      created_date: convertUTCDateToLocalDate(new Date(year, month, i + 1)),
      total_units_sold: 0,
      total_discounted_price: 0,
      total_sales: 0,
    }));

  dates.forEach((date) => {
    const saleIndex = sales.findIndex(
      (sale) => sale.created_date.getTime() === date.created_date.getTime()
    );
    if (saleIndex !== -1) {
      date.total_units_sold = sales[saleIndex].total_units_sold;
      date.total_discounted_price = sales[saleIndex].total_discounted_price;
      date.total_sales = sales[saleIndex].total_sales;
    }
  });

  return dates;
};

const getTotalSales = async (condition: SQL<unknown> | undefined) => {
  return (
    (
      await db
        .select({
          // category_name: categories.name,
          total_units_sold: sum(orders.product_quantity),
          total_discounted_price: sum(
            orders.product_variation_discount_final_price
          ),
          total_sales: sum(orders.product_variation_final_price),
        })
        .from(orders)
        .leftJoin(products, eq(orders.product_id, products.id))
        .leftJoin(categories, eq(categories.id, products.category_id))
        .where(condition)
    )
      // .groupBy((data) => [data.category_name])
      .map((sale) => ({
        total_units_sold: Number(Number(sale.total_units_sold).toFixed(2)),
        total_discounted_price: Number(
          Number(sale.total_discounted_price).toFixed(2)
        ),
        total_sales: Number(
          (
            Number(sale.total_sales) + Number(sale.total_discounted_price)
          ).toFixed(2)
        ),
        total_revenue: Number(Number(sale.total_sales).toFixed(2)),
      }))[0]
  );
};