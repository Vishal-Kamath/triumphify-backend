import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";

const handleGetAllCategories = async (req: Request, res: Response) => {
  try {
    const allCategories = await db.select().from(categories);

    res.status(200).send({
      data: allCategories,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get Category error: ", err);
    res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleGetAllCategories;
