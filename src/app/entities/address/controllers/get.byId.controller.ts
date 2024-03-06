import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleAddressGetById = async (
  req: Request<{ addressId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { addressId } = req.params;
    const { id } = req.body.token;

    const address = (
      await db
        .select()
        .from(addresses)
        .where(and(eq(addresses.id, addressId), eq(addresses.user_id, id)))
    )[0];

    if (!address) {
      return res.status(404).send({
        description: "Address not found",
        type: "error",
      });
    }

    res.status(200).send({
      data: address,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get address by id error", err);
    res.status(500).send({
      description: "Something went wrong",
      type: "error",
    });
  }
};

export default handleAddressGetById;
