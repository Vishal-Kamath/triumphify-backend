import { Request, Response } from "express";
import { ContactType } from "../validators.contact";
import { Logger } from "@/utils/logger";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { v4 as uuid } from "uuid";

const handleCreateContact = async (
  req: Request<{ source: string }, {}, ContactType>,
  res: Response
) => {
  try {
    const { name, email, tel } = req.body;
    const { source } = req.params;

    const contact = await db.insert(leads).values({
      id: uuid(),
      name,
      email,
      source,
      tel,
    });

    res.status(201).send({
      type: "success",
    });
  } catch (err) {
    Logger.error("handle create contact: ", err);
    res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleCreateContact;
