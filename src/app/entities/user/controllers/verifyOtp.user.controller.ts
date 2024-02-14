import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { UserVerifyEmailOtpType } from "../validators.user";
import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { otpVerification, users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

const handleVerifyOtp = async (
  req: Request<{}, {}, UserVerifyEmailOtpType & TokenPayload>,
  res: Response
) => {
  try {
    const { code } = req.body;
    const { id } = req.body.token;

    const user = (
      await db.select().from(users).where(eq(users.id, id)).limit(1)
    )[0];

    if (!user) {
      return res
        .status(404)
        .json({ description: "User not found", type: "error" });
    }

    const verifyOtp = (
      await db
        .select()
        .from(otpVerification)
        .where(
          and(
            eq(otpVerification.email, user.email),
            eq(otpVerification.otp, code),
            eq(otpVerification.for, "email")
          )
        )
        .limit(1)
    )[0];

    if (!verifyOtp) {
      return res
        .status(400)
        .json({ description: "Invalid OTP", type: "error" });
    }

    await db
      .delete(otpVerification)
      .where(
        and(
          eq(otpVerification.email, user.email),
          eq(otpVerification.otp, code),
          eq(otpVerification.for, "email")
        )
      );
    await db.update(users).set({ emailVerified: true }).where(eq(users.id, id));

    return res.status(200).json({
      title: "Email verified",
      description: `Email ${user.email} was verified successfully`,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle verify otp error", err);
    res
      .status(500)
      .json({ description: "internal server error", type: "error" });
  }
};

export default handleVerifyOtp;
