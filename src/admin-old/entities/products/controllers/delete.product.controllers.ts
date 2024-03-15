import { db } from "@/lib/db";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import {
  product_showcase,
  product_attributes,
  product_variations,
  products,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import axios from "axios";
import { env } from "@/config/env.config";
import { getNamefromLink } from "@/utils/cdn.utils";

const handleDeleteProduct = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const findProduct = (
      await db.select().from(products).where(eq(products.id, id)).limit(1)
    )[0];
    if (!findProduct) {
      return res.status(404).send({
        description: "product not found",
        type: "error",
      });
    }
    axios
      .post(`${env.CDN_ENDPOINT}/api/images/delete/multiple`, {
        names: (findProduct.product_images as string[]).map((val) =>
          getNamefromLink(val)
        ),
      })
      .then(async (delRes) => {
        await db.transaction(async (trx) => {
          await trx
            .delete(product_showcase)
            .where(eq(product_showcase.product_id, id));
          await trx
            .delete(product_attributes)
            .where(eq(product_attributes.product_id, id));
          await trx
            .delete(product_variations)
            .where(eq(product_variations.product_id, id));
          await trx.delete(products).where(eq(products.id, id));
        });

        return res.status(200).send({
          title: "Success",
          description: "product deleted successfully",
          type: "success",
        });
      })
      .catch((err) => {
        Logger.error("handle delete product images", err);
        res.status(500).send({
          description: "something went wrong",
          type: "error",
        });
      });
  } catch (err) {
    Logger.error("handle delete product", err);
    res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleDeleteProduct;
