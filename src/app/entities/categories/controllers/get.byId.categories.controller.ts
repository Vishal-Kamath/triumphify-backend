import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetCategoryBySlug = async (
  req: Request<{ slug: string }>,
  res: Response
) => {
  try {
    const { slug } = req.params;
    const category = (
      await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1)
    )[0];
    if (!category) {
      res
        .status(404)
        .send({ description: "Category not found", type: "error" });
      return;
    }

    res.status(200).send({
      data: category,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get Category by id error: ", err);
    res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleGetCategoryBySlug;
