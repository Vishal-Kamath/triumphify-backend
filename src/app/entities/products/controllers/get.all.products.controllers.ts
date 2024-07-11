import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllProducts = async (req: Request, res: Response) => {
  try {
    const allProducts = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        brand_name: products.brand_name,
        category: categories.name,
        description: products.description,
        product_accordians: products.product_accordians,
        product_images: products.product_images,

        created_at: products.created_at,
        updated_at: products.updated_at,
      })
      .from(products)
      .limit(0)
      .leftJoin(categories, eq(products.category_id, categories.id));

    return res.status(200).send({
      data: allProducts,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get all products error:", err);
    res.status(500).send({
      description: "Internal server error",
      type: "error",
    });
  }
};

export default handleGetAllProducts;
