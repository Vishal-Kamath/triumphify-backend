import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { otpVerification, users } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import sendEmail from "@/utils/mailer/mailer";
import { emailVerificationMailFormat } from "@/utils/mailer/verification.mail";
import { generateOTP } from "@/utils/otp.utils";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleSendEmailOTP = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;

    const { email } = (
      await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, id))
        .limit(1)
    )[0];
    if (!email) {
      return res
        .status(400)
        .json({ description: "Email not found", type: "error" });
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
        for: "email",
      });
    }

    sendEmail({
      email,
      subject: "Email Verification",
      message: emailVerificationMailFormat(otp),
    });

    deleteOtp(otp);
    return res.status(200).send({
      title: "OTP generated",
      description: `OTP successfully sent to email ${email}`,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle verify email");
  }
};

export default handleSendEmailOTP;

async function deleteOtp(otp: string) {
  setTimeout(async () => {
    await db.delete(otpVerification).where(eq(otpVerification.otp, otp));
  }, 1000 * 60 * 15);
}
