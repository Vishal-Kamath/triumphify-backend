import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ResetPasswordType } from "../validators.auth";
import { verifyJwt } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { otpVerification, employee } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { addTokens, removeTokens } from "../utils/auth";
import { CSVLogger } from "@/utils/csv.logger";
import { getRole } from "@/admin/utils/getRole";

const handleResetPassword = async (
  req: Request<{}, {}, ResetPasswordType>,
  res: Response
) => {
  try {
    const { password, otp, token } = req.body;

    const { decoded, expired, valid } = verifyJwt({
      key: "RESET_TOKEN_PUBLIC",
      token,
    });
    if (!decoded || expired || !valid) {
      return res
        .status(400)
        .json({ description: "Invalid token", type: "error" });
    }

    const otpValue = (
      await db
        .select()
        .from(otpVerification)
        .where(eq(otpVerification.otp, otp))
        .limit(1)
    )[0];
    if (!otpValue) {
      return res
        .status(400)
        .json({ description: "Invalid OTP", type: "error" });
    }

    const findEmployee = (
      await db
        .select()
        .from(employee)
        .where(
          and(
            eq(employee.id, decoded.token.id),
            eq(employee.email, otpValue.email)
          )
        )
        .limit(1)
    )[0];
    if (!findEmployee) {
      return res
        .status(400)
        .json({ description: "User not found", type: "error" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .update(employee)
      .set({ password: hashedPassword })
      .where(eq(employee.id, findEmployee.id));

    await db.delete(otpVerification).where(eq(otpVerification.otp, otp));

    removeTokens(res);
    addTokens(res, findEmployee.id, findEmployee.role);

    CSVLogger.succes(
      findEmployee.id,
      getRole(findEmployee.role),
      "Password reset"
    );
    res.status(200).json({
      title: "Password reset successfully",
      description: "You have been logged back in successfully!",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle reset password error", err);
    res
      .status(500)
      .json({ description: "Internal server error", type: "error" });
  }
};

export default handleResetPassword;
