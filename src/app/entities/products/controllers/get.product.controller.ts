import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetProduct = async (
  req: Request<{ slug: string }>,
  res: Response
) => {
  try {
    const { slug } = req.params;
    const product = (
      await db
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
        .where(eq(products.slug, slug))
        .limit(0)
        .leftJoin(categories, eq(products.category_id, categories.id))
    )[0];

    if (!product) {
      return res.status(404).send({
        description: "Product not found",
        type: "error",
      });
    }

    return res.status(200).send({
      data: product,
      type: "success",
    });
  } catch (err) {}
};

export default handleGetProduct;
