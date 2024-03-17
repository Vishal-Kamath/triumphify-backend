import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqProduct } from "../validators.products";
import axios from "axios";
import { env } from "@/config/env.config";
import { db } from "@/lib/db";
import {
  product_attributes,
  product_variations,
  products,
} from "@/lib/db/schema";
import { v4 as uuid } from "uuid";
import slugify from "slugify";
import { eq } from "drizzle-orm";

const handleCreateProduct = async (
  req: Request<{}, {}, ReqProduct>,
  res: Response
) => {
  try {
    const {
      name,
      brand_name,
      category_id,
      description,
      product_accordians,
      attributes,
      variations,
      meta_title,
      meta_description,
      meta_keywords,
      product_images,
    } = req.body;

    const slug = slugify(name.toLowerCase());
    const productExists = (
      await db.select().from(products).where(eq(products.slug, slug)).limit(1)
    )[0];
    if (productExists) {
      return res.status(400).send({
        description: "Product already exists",
        type: "error",
      });
    }

    const product_id = uuid();
    const attributesFormated = attributes.map((attribute) => ({
      id: uuid(),
      product_id,
      key: attribute.key,
      parent: attribute.parent,
      value: attribute.value,
    }));

    const variationsFormated = variations.map((variation) => ({
      id: uuid(),
      product_id,
      key: variation.key,
      combinations: variation.combinations,
      quantity: variation.quantity,
      discount: variation.discount,
      price: variation.price,
    }));

    axios
      .post<{ imageLinks: string[] }>(
        `${env.CDN_ENDPOINT}/api/images/multiple`,
        {
          files: product_images,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        const imageLinks = response.data.imageLinks;
        await db.transaction(async (tx) => {
          await tx.insert(products).values({
            id: product_id,
            name,
            slug,
            brand_name,
            category_id,
            description,
            product_accordians: product_accordians || [],
            product_images: imageLinks,
            meta_title,
            meta_description,
            meta_keywords,
          });

          for (const attribute of attributesFormated) {
            await tx.insert(product_attributes).values(attribute);
          }

          for (const variation of variationsFormated) {
            await tx.insert(product_variations).values(variation);
          }
        });

        Logger.info("Product created successfully");
        res.status(200).send({
          title: "Product created successfully",
          description: `product "${name}" successfully created`,
          type: "success",
        });
      })
      .catch((err) => {
        Logger.error("handle create product images error:", err);
        res
          .status(500)
          .send({ description: "something went wrong", type: "error" });
      });
  } catch (err) {
    Logger.error("handle create product error:", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};
export default handleCreateProduct;
