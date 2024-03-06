import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";

const handleGetAllCategories = async (req: Request, res: Response) => {
  try {
    const categoriesList = await db.select().from(categories);

    res.status(200).send({
      data: categoriesList,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get Categores error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllCategories;
