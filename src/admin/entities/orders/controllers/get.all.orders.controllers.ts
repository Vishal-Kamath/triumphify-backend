import { db } from "@/lib/db";
import { orders, tickets, users } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, count, desc, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllOrders = async (req: Request, res: Response) => {
  try {
    const ordersList = await db
      .select({
        id: orders.id,
        group_id: orders.group_id,
        user_id: orders.user_id,
        user_username: users.username,
        user_image: users.image,

        // notification
        notifications: count(tickets.link),

        // product details
        product_id: orders.product_id,
        product_name: orders.product_name,
        product_slug: orders.product_slug,
        product_image: orders.product_image,
        product_brand_name: orders.product_brand_name,
        product_description: orders.product_description,
        product_quantity: orders.product_quantity,

        // product variations
        product_variation_key: orders.product_variation_key,
        product_variation_combinations: orders.product_variation_combinations,
        product_variation_discount: orders.product_variation_discount,
        product_variation_discount_price:
          orders.product_variation_discount_price,
        product_variation_discount_final_price:
          orders.product_variation_discount_final_price,
        product_variation_price: orders.product_variation_price,
        product_variation_final_price: orders.product_variation_final_price,

        // order statuses
        cancelled: orders.cancelled,
        returned: orders.returned,

        status: orders.status,

        created_date: orders.created_date,
        created_at: orders.created_at,
        updated_at: orders.updated_at,
      })
      .from(orders)
      .leftJoin(users, eq(orders.user_id, users.id))
      .leftJoin(
        tickets,
        and(eq(tickets.link, orders.id), eq(tickets.status, "pending"))
      )
      .groupBy((data) => [
        data.id,
        data.group_id,
        data.user_id,

        // product details
        data.product_id,
        data.product_name,
        data.product_slug,
        data.product_image,
        data.product_brand_name,
        data.product_description,
        data.product_quantity,

        // product variations
        data.product_variation_key,
        data.product_variation_combinations,
        data.product_variation_discount,
        data.product_variation_discount_price,
        data.product_variation_discount_final_price,
        data.product_variation_price,
        data.product_variation_final_price,

        // order statuses
        data.cancelled,
        data.returned,

        data.status,

        data.created_date,
        data.created_at,
        data.updated_at,
      ])
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
