import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleDeleteAddress = async (
  req: Request<{ addressId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { addressId } = req.params;
    const { id } = req.body.token;

    await db
      .delete(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.user_id, id)));

    res.status(200).send({
      title: "Success",
      description: "Address deleted successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle delete address error", err);
    res.status(500).send({
      description: "Something went wrong",
      type: "error",
    });
  }
};

export default handleDeleteAddress;
