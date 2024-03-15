import { db } from "@/lib/db";
import { attributes } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleDeleteAttribute = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    await db.delete(attributes).where(eq(attributes.id, id));

    return res.status(200).send({
      title: "Success",
      description: "Attribute deleted successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle delete attribute", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleDeleteAttribute;
