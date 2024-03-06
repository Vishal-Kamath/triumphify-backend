import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllAddresses = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;
    const allUserAddresses = await db
      .select({
        id: addresses.id,
        name: addresses.name,
        street_address: addresses.street_address,
        city: addresses.city,
        state: addresses.state,
        zip: addresses.zip,
        country: addresses.country,
        tel: addresses.tel,
        email: addresses.email,
      })
      .from(addresses)
      .where(eq(addresses.user_id, id));

    res.status(200).send({
      data: allUserAddresses,
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

export default handleGetAllAddresses;
