import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { blogs } from "@/lib/db/schema/blog";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetLinkedContent = async (req: Request, res: Response) => {
  try {
    const getLinkedProduct = (
      await db
        .select()
        .from(products)
        .where(eq(products.linked_to_main_banner, true))
        .limit(1)
    ).pop();
    const getLinkedBlog = (
      await db
        .select()
        .from(blogs)
        .where(eq(blogs.linked_to_main_banner, true))
        .limit(1)
    ).pop();

    res
      .status(200)
      .send({
        data: { product: getLinkedProduct, blog: getLinkedBlog },
        type: "success",
      });
  } catch (err) {
    Logger.error("Error in handleGetLinkedContent", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetLinkedContent;
