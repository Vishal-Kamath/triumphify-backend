import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { db } from "@/lib/db";
import { otpVerification, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { UserEmail } from "../validators.user";
import sendEmail from "@/utils/mailer/mailer";
import { resetPasswordFormat } from "@/utils/mailer/resetPassword";
import { generateOTP } from "@/utils/otp.utils";
import { signToken } from "@/app/utils/jwt.utils";
import { env } from "@/config/env.config";

const handleSendResetPasswordLink = async (
  req: Request<{}, {}, UserEmail>,
  res: Response
) => {
  try {
    const { email } = req.body;

    const fetchUser = (
      await db.select().from(users).where(eq(users.email, email)).limit(1)
    )[0];
    if (!fetchUser || !fetchUser.email) {
      return res
        .status(400)
        .json({ description: "User not found", type: "error" });
    }

    const otp = await generateOTP();
    const IfOtpEmailExists = (
      await db
        .select()
        .from(otpVerification)
        .where(eq(otpVerification.email, email))
    )[0];

    if (IfOtpEmailExists) {
      await db
        .update(otpVerification)
        .set({
          otp,
        })
        .where(eq(otpVerification.email, email));
    } else {
      await db.insert(otpVerification).values({
        email,
        otp,
        ip: req.ip,
        for: "reset-password",
      });
    }

    const token = signToken({ key: "RESET_TOKEN_PRIVATE", id: fetchUser.id });
    sendEmail({
      email: fetchUser.email,
      subject: "Reset Password",
      message: resetPasswordFormat(
        `${env.APP_WEBSITE}/auth/reset-password?token=${token}&otp=${otp}`
      ),
    });

    res.status(200).send({
      title: "Success!",
      description: "Reset password link sent successfully to your email!",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle send reset password link error: ", err);
    res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleSendResetPasswordLink;
