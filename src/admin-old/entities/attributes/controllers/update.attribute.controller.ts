import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqAttributes } from "../validators.attributes";
import { db } from "@/lib/db";
import { attributes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const handleUpdateAttribute = async (
  req: Request<{ id: string }, {}, ReqAttributes>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, values } = req.body;

    const attributeExists = (
      await db.select().from(attributes).where(eq(attributes.id, id)).limit(1)
    )[0];
    if (!attributeExists) {
      return res.status(404).send({
        description: `attribute does not exist`,
        type: "error",
      });
    }

    await db
      .update(attributes)
      .set({ name, values })
      .where(eq(attributes.id, id));

    return res.status(200).send({
      title: "Success",
      description: `attribute "${name}" updated`,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle update attribute", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleUpdateAttribute;
