import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { RequestAddress } from "../validators.address";
import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

const handleUpdateAddress = async (
  req: Request<{ addressId: string }, {}, RequestAddress & TokenPayload>,
  res: Response
) => {
  try {
    const { addressId } = req.params;
    const { name, tel, email, street_address, city, state, country, zip } =
      req.body;
    const { id } = req.body.token;

    const checkIfExists = (
      await db
        .select()
        .from(addresses)
        .where(and(eq(addresses.id, addressId), eq(addresses.user_id, id)))
    )[0];
    if (!checkIfExists) {
      return res.status(404).send({
        description: "Address not found",
        type: "error",
      });
    }

    await db
      .update(addresses)
      .set({
        name,
        tel,
        email,
        street_address,
        city,
        state,
        country,
        zip,
      })
      .where(and(eq(addresses.id, addressId), eq(addresses.user_id, id)));

    res.status(200).send({
      title: "Success",
      description: "Address updated successfully",
      type: "success",
    });
  } catch (error) {
    Logger.error("handle update address error", error);
    res.status(500).send({
      description: "Something went wrong",
      type: "error",
    });
  }
};

export default handleUpdateAddress;
