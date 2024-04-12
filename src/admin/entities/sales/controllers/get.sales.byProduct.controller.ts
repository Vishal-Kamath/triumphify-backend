import { db } from "@/lib/db";
import { orders, products } from "@/lib/db/schema";
import { convertUTCDateToLocalDate } from "@/utils/getUTCDate";
import { Logger } from "@/utils/logger";
import { SQL, and, eq, gte, lte, or, sum } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetSalesByProduct = async (
  req: Request<
    { productId: string },
    {},
    {},
    { month: number; year: number; type: "history" | "cancelled" | "returned" }
  >,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const getProduct = (
      await db.select().from(products).where(eq(products.id, productId))
    )[0];
    if (!getProduct) {
      res
        .status(404)
        .send({ data: [], description: "Product not found", type: "error" });
      return;
    }

    const month = req.query.month || new Date().getMonth();
    const year = req.query.year || new Date().getFullYear();

    const start_date = new Date(year, month, 1);
    const end_date = new Date(year, Number(month) + 1, 1);

    const previous_start_date = new Date(year, month - 1, 1);

    const type = req.query.type;
    const condition = getCondition(productId, start_date, end_date, type);
    const previousMonthCondition = getCondition(
      productId,
      previous_start_date,
      start_date,
      type
    );

    const sales = await getSales(
      condition,
      month,
      year,
      productId,
      getProduct.name
    );

    const sales_total = await getTotalSales(condition);
    const previous_sales_total = await getTotalSales(previousMonthCondition);

    res.status(200).send({
      data: { sales, sales_total, previous_sales_total },
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get sales by product", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetSalesByProduct;

const getCondition = (
  productId: string,
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
          eq(products.id, productId)
        ),
        and(
          start_date ? gte(orders.created_at, start_date) : undefined,
          end_date ? lte(orders.created_at, end_date) : undefined,
          eq(orders.cancelled, true),
          eq(orders.returned, true),
          eq(products.id, productId)
        )
      )
    : type === "cancelled"
    ? and(
        start_date ? gte(orders.created_at, start_date) : undefined,
        end_date ? lte(orders.created_at, end_date) : undefined,
        eq(orders.cancelled, true),
        eq(orders.returned, false),
        eq(products.id, productId)
      )
    : and(
        start_date ? gte(orders.created_at, start_date) : undefined,
        end_date ? lte(orders.created_at, end_date) : undefined,
        eq(orders.cancelled, false),
        eq(orders.returned, true),
        eq(products.id, productId)
      );
};

const getSales = async (
  condition: SQL<unknown> | undefined,
  month: number,
  year: number,
  productId: string,
  productName: string
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
      product_id: productId,
      product_name: productName,
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
          total_units_sold: sum(orders.product_quantity),
          total_discounted_price: sum(
            orders.product_variation_discount_final_price
          ),
          total_sales: sum(orders.product_variation_final_price),
        })
        .from(orders)
        .leftJoin(products, eq(orders.product_id, products.id))
        .where(condition)
    )
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