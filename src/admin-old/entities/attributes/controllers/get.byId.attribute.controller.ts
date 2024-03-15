import { db } from "@/lib/db";
import { attributes } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAttributeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const attribute = (
      await db.select().from(attributes).where(eq(attributes.id, id)).limit(1)
    )[0];
    if (!attribute) {
      res
        .status(404)
        .send({ description: "Attribute not found", type: "error" });
      return;
    }

    res.status(200).send({
      data: attribute,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get Attribute by id error: ", err);
    res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleGetAttributeById;
