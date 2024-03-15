import { db } from "@/lib/db";
import { attributes } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";

const handleGetAllAttributes = async (req: Request, res: Response) => {
  try {
    const allAttributes = await db.select().from(attributes);

    res.status(200).send({
      data: allAttributes,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get all attributes", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllAttributes;
