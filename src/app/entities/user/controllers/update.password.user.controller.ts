import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { UserUpdatePasswordType } from "../validators.user";
import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

const handleUpdatePassword = async (
  req: Request<{}, {}, UserUpdatePasswordType & TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;
    const { currentPassword, newPassword } = req.body;

    const findUser = (
      await db.select().from(users).where(eq(users.id, id)).limit(1)
    )[0];
    if (!findUser) {
      return res
        .status(404)
        .send({ description: "User not found", type: "error" });
    }

    const checkPassword = await bcrypt.compare(
      currentPassword,
      findUser.password
    );
    if (!checkPassword) {
      return res.status(400).send({
        title: "Error",
        description: "Incorrect Password",
        type: "error",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id));

    return res.status(200).send({
      title: "Password update",
      description: "new password saved successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle update password error");
    res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleUpdatePassword;
