import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = (
      await db.select().from(categories).where(eq(categories.id, id)).limit(1)
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

export default handleGetCategoryById;
