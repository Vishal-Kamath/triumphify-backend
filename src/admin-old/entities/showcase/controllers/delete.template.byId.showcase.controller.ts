import { db } from "@/lib/db";
import { product_showcase } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleDeleteTemplateById = async (
  req: Request<{ templateId: string }>,
  res: Response
) => {
  try {
    const { templateId } = req.params;
    await db
      .delete(product_showcase)
      .where(eq(product_showcase.id, templateId));

    res.status(200).send({
      title: "Success",
      description: "template deleted successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle delete template by id error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleDeleteTemplateById;
