import { db } from "@/lib/db";
import {
  categories,
  product_attributes,
  product_variations,
  products,
} from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetProductBuyDetails = async (
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

    // reformat the product attributes
    const tempAttributes = await db
      .select()
      .from(product_attributes)
      .where(eq(product_attributes.product_id, product.id));

    const tempHash: { [key: string]: string[] } = {};
    for (const attribute of tempAttributes) {
      if (!tempHash[attribute.parent]) {
        tempHash[attribute.parent] = [];
      }
      tempHash[attribute.parent].push(attribute.value);
    }

    const productAttributes = [];
    for (const key in tempHash) {
      productAttributes.push({
        name: key,
        values: tempHash[key].map((value) => ({ name: value })),
      });
    }

    const productVariations = await db
      .select({
        id: product_variations.id,
        key: product_variations.key,
        combinations: product_variations.combinations,
        quantity: product_variations.quantity,
        discount: product_variations.discount,
        price: product_variations.price,
      })
      .from(product_variations)
      .where(eq(product_variations.product_id, product.id));

    const newProduct = {
      ...product,
      attributes: productAttributes,
      variations: productVariations,
    };

    res.status(200).send({
      data: newProduct,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get product buy details", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetProductBuyDetails;
