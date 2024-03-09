import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqUpdateProduct } from "../validators.products";
import slugify from "slugify";
import { db } from "@/lib/db";
import {
  cart,
  product_attributes,
  product_variations,
  products,
} from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import axios from "axios";
import { env } from "@/config/env.config";
import { v4 as uuid } from "uuid";
import { getNamefromLink } from "@/utils/cdn.utils";

const handleUpdateProduct = async (
  req: Request<{ id: string }, {}, ReqUpdateProduct>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand_name,
      category_id,
      gst_price,
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
    const findProduct = (
      await db.select().from(products).where(eq(products.id, id)).limit(1)
    )[0];
    if (!findProduct) {
      return res.status(404).send({
        description: "Product doesn't exists",
        type: "error",
      });
    }

    const findAttributes = await db
      .select()
      .from(product_attributes)
      .where(eq(product_attributes.product_id, id));

    const findVariations = await db
      .select()
      .from(product_variations)
      .where(eq(product_variations.product_id, id));

    if (findProduct.name !== name) {
      const productExists = (
        await db
          .select()
          .from(products)
          .where(or(eq(products.name, name), eq(products.slug, slug)))
          .limit(1)
      )[0];
      if (productExists) {
        return res.status(400).send({
          description: "Product already with this name exists",
          type: "error",
        });
      }
    }

    // Sorting and Formating
    const stringImages = product_images.filter(
      (image) => typeof image === "string"
    );
    const deletedImages = (findProduct.product_images as string[]).filter(
      (link) => !stringImages.includes(link)
    );

    const onlyKeyAttributes = attributes.map((attr) => attr.key);
    const onlyKeyFindAttributes = findAttributes.map((attr) => attr.key);
    const deletedAttributes = findAttributes.filter(
      (attribute) => !onlyKeyAttributes.includes(attribute.key)
    );
    const createdAttributes = attributes
      .filter((attribute) => !onlyKeyFindAttributes.includes(attribute.key))
      .map((attribute) => ({
        id: uuid(),
        product_id: id,
        key: attribute.key,
        parent: attribute.parent,
        value: attribute.value,
      }));

    const onlyKeyVariations = variations.map((variation) => variation.key);
    const onlyKeyFindVariations = findVariations.map(
      (variation) => variation.key
    );
    const deletedVariations = findVariations.filter(
      (variation) => !onlyKeyVariations.includes(variation.key)
    );
    const updatedVariations = variations.filter((variation) =>
      onlyKeyFindVariations.includes(variation.key)
    );
    const createdVariations = variations
      .filter((variation) => !onlyKeyFindVariations.includes(variation.key))
      .map((variation) => ({
        id: uuid(),
        product_id: id,
        key: variation.key,
        combinations: variation.combinations,
        quantity: variation.quantity,
        discount: variation.discount,
        price: variation.price,
      }));

    axios
      .post<{ imageLinks: string[] }>(
        `${env.CDN_ENDPOINT}/api/images/multiple/conditional`,
        {
          files: product_images,
        }
      )
      .then((resConShuffle) => {
        const { imageLinks } = resConShuffle.data;

        axios
          .post(`${env.CDN_ENDPOINT}/api/images/delete/multiple`, {
            names: deletedImages.map((val) => getNamefromLink(val)),
          })
          .then(async (delRes) => {
            await db.transaction(async (tx) => {
              await tx
                .update(products)
                .set({
                  name,
                  slug,
                  brand_name,
                  category_id,
                  gst_price,
                  description,
                  product_accordians: product_accordians || [],
                  product_images: imageLinks,
                  meta_title,
                  meta_description,
                  meta_keywords,
                })
                .where(eq(products.id, id));

              for (const attribute of deletedAttributes) {
                await tx
                  .delete(product_attributes)
                  .where(eq(product_attributes.id, attribute.id));
              }
              for (const attribute of createdAttributes) {
                await tx.insert(product_attributes).values(attribute);
              }

              // delete carts with this variation
              for (const variation of deletedVariations) {
                await tx
                  .delete(cart)
                  .where(eq(cart.product_variation_id, variation.id));
              }

              for (const variation of deletedVariations) {
                await tx
                  .delete(product_variations)
                  .where(eq(product_variations.id, variation.id));
              }

              for (const variation of updatedVariations) {
                await tx
                  .update(product_variations)
                  .set({
                    discount: variation.discount,
                    quantity: variation.quantity,
                    price: variation.price,
                  })
                  .where(eq(product_variations.key, variation.key));
              }
              for (const variation of createdVariations) {
                await tx.insert(product_variations).values(variation);
              }
            });
            res.status(200).send({
              title: "Product Updatated",
              description: `product "${name}" successfully updated`,
              type: "success",
            });
          })
          .catch((err) => {
            Logger.error("handle update product delete multiple image", err);
            res
              .status(500)
              .send({ description: "something went wrong", type: "error" });
          });
      })
      .catch((err) => {
        Logger.error("handle update product shuffle multiple image", err);
        res
          .status(500)
          .send({ description: "something went wrong", type: "error" });
      });
  } catch (err) {
    Logger.error("handle update product", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleUpdateProduct;
