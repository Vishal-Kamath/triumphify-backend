import { TokenPayload } from "@app/utils/jwt.utils";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import _ from "lodash";

const handleGetUser = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;

    const user = (
      await db.select().from(users).where(eq(users.id, id)).limit(1)
    )[0];
    if (!user) {
      return res
        .status(404)
        .send({ description: "User not found", type: "error" });
    }

    let needs_to_reset_password = user.password === "google-auth";

    return res.status(200).send({
      data: { ..._.omit(user, ["password"]), needs_to_reset_password },
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get user error", err);
    return res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};
export default handleGetUser;
