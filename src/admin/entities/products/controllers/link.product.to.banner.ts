import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, ne } from "drizzle-orm";
import { ReqLinkToBanner } from "../validators.products";

const handleLinkProductToBanner = async (
  req: Request<{ id: string }, {}, ReqLinkToBanner>,
  res: Response
) => {
  try {
    const { linked_to_main_banner } = req.body;
    const { id } = req.params;

    const findProduct = (
      await db.select().from(products).where(eq(products.id, id)).limit(1)
    ).pop();
    if (!findProduct) {
      return res.status(404).send({
        description: "product not found",
        type: "error",
      });
    }

    await db.transaction(async (trx) => {
      await trx
        .update(products)
        .set({ linked_to_main_banner })
        .where(eq(products.id, id));
      await trx
        .update(products)
        .set({ linked_to_main_banner: false })
        .where(ne(products.id, id));
    });

    res.status(200).send({
      description: `product "${findProduct.name}" ${
        linked_to_main_banner ? "linked" : "unlinked"
      } successfully`,
      type: "success",
    });
  } catch (error) {
    Logger.error("handle link product to banner", error);
    res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleLinkProductToBanner;
