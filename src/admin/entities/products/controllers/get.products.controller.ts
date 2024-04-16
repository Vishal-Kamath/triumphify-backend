import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetProducts = async (req: Request, res: Response) => {
  try {
    const productsList = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        slug: products.slug,
        brand_name: products.brand_name,
        category: categories.name,
        product_images: products.product_images,
        meta_title: products.meta_title,
        meta_description: products.meta_description,
        meta_keywords: products.meta_keywords,

        created_at: products.created_at,
        updated_at: products.updated_at,
      })
      .from(products)
      .leftJoin(categories, eq(products.category_id, categories.id));

    res.status(200).send({
      data: productsList,
      type: "success",
    });
  } catch (error) {
    Logger.error("handle get products", error);
    res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetProducts;
