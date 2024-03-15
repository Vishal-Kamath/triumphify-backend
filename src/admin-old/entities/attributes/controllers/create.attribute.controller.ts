import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqAttributes } from "../validators.attributes";
import { db } from "@/lib/db";
import { attributes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

const handleCreateAttribute = async (
  req: Request<{}, {}, ReqAttributes>,
  res: Response
) => {
  try {
    const { name, values } = req.body;

    const attributeExists = (
      await db
        .select()
        .from(attributes)
        .where(eq(attributes.name, name))
        .limit(1)
    )[0];
    if (attributeExists) {
      return res.status(400).send({
        description: `attribute "${name}" already exists`,
        type: "error",
      });
    }

    await db.insert(attributes).values({
      id: uuid(),
      name,
      values,
    });

    return res.status(201).send({
      title: "Success",
      description: `attribute "${name}" created`,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle create attribute", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleCreateAttribute;
