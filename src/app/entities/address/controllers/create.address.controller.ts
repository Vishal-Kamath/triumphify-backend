import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { RequestAddress } from "../validators.address";
import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

const handleCreateAddress = async (
  req: Request<{}, {}, RequestAddress & TokenPayload>,
  res: Response
) => {
  try {
    const { name, tel, email, street_address, city, state, country, zip } =
      req.body;
    const { id } = req.body.token;

    const checkIfAddressExist = (
      await db
        .select()
        .from(addresses)
        .where(and(eq(addresses.user_id, id), eq(addresses.name, name)))
        .limit(1)
    )[0];
    if (checkIfAddressExist) {
      return res.status(400).send({
        description: "Address already exist",
        type: "error",
      });
    }

    const newAddress = await db.insert(addresses).values({
      id: uuid(),
      user_id: id,
      name,
      tel,
      email,
      street_address,
      city,
      state,
      country,
      zip,
    });

    res.status(201).send({
      title: "Success",
      description: "Address created successfully",
      type: "success",
    });
  } catch (error) {
    Logger.error("handle create address error", error);
    res.status(500).send({
      description: "Something went wrong",
      type: "error",
    });
  }
};

export default handleCreateAddress;
