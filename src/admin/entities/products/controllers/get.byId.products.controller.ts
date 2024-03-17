import fs from "fs";
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

const handleGetByIdProducts = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const product = (
      await db.select().from(products).where(eq(products.id, id)).limit(1)
    )[0];

    // reformat the product attributes
    const tempAttributes = await db
      .select()
      .from(product_attributes)
      .where(eq(product_attributes.product_id, id));

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
        key: product_variations.key,
        combinations: product_variations.combinations,
        quantity: product_variations.quantity,
        discount: product_variations.discount,
        price: product_variations.price,
      })
      .from(product_variations)
      .where(eq(product_variations.product_id, id));

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
    Logger.error("handle get by id products", err);
    res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetByIdProducts;
