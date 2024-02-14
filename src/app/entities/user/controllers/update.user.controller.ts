import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { UserDetailsType } from "../validators.user";
import { TokenPayload } from "@app/utils/jwt.utils";
import { users } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

const handleUpdateUser = async (
  req: Request<{}, {}, UserDetailsType & TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;
    const { username, gender, email, dateOfBirth } = req.body;

    const findUser = (
      await db.select().from(users).where(eq(users.id, id)).limit(1)
    )[0];
    if (!findUser) {
      return res
        .status(404)
        .send({ description: "User not found", type: "error" });
    }

    await db
      .update(users)
      .set({
        username,
        email,
        emailVerified:
          findUser.email === email ? findUser.emailVerified : false,
        gender,
        dateOfBirth,
      })
      .where(eq(users.id, id));

    if (findUser.email !== email) {
      // TODO: send email verification
    }
    return res.status(200).send({
      title: "Success",
      description: "User updated successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle update user error", err);
    res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleUpdateUser;
