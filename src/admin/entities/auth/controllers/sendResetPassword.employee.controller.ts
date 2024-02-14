import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { db } from "@/lib/db";
import { otpVerification, employee } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { EmployeeEmail } from "../validators.auth";
import sendEmail from "@/utils/mailer/mailer";
import { resetPasswordFormat } from "@/utils/mailer/resetPassword";
import { generateOTP } from "@/utils/otp.utils";
import { signToken } from "@/app/utils/jwt.utils";

const handleSendResetPasswordLink = async (
  req: Request<{}, {}, EmployeeEmail>,
  res: Response
) => {
  try {
    const { email } = req.body;

    const fetchEmployee = (
      await db.select().from(employee).where(eq(employee.email, email)).limit(1)
    )[0];
    if (!fetchEmployee || !fetchEmployee.email) {
      return res
        .status(400)
        .json({ description: "Employee not found", type: "error" });
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

    const token = signToken({
      key: "RESET_TOKEN_PRIVATE",
      id: fetchEmployee.id,
    });
    sendEmail({
      email: fetchEmployee.email,
      subject: "Reset Password",
      message: resetPasswordFormat(
        `http://localhost:3000/auth/reset-password?token=${token}&otp=${otp}`
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
