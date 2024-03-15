import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { getNamefromLink } from "@/utils/cdn.utils";
import { Logger } from "@/utils/logger";
import axios from "axios";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleDeleteCategory = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const findCategory = (
      await db.select().from(categories).where(eq(categories.id, id)).limit(1)
    )[0];
    if (!findCategory) {
      return res.status(404).send({
        title: "Error",
        description: "Category not found",
        type: "error",
      });
    }
    axios
      .delete(
        `${
          process.env.CDN_ENDPOINT
        }/api/images/delete/multiple?names=${getNamefromLink(
          findCategory.category_image
        )}`
      )
      .then(async () => {
        await db.delete(categories).where(eq(categories.id, id));

        return res.status(200).send({
          title: "Success",
          description: "Category deleted successfully",
          type: "success",
        });
      })
      .catch((err) => {
        Logger.error("handle delete category", err);
        return res
          .status(500)
          .send({ description: "something went wrong", type: "error" });
      });
  } catch (err) {
    Logger.error("handle delete category", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleDeleteCategory;
