import { db } from "@/lib/db";
import { otpVerification } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function otpBuilder(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let otp = "";

  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters.charAt(randomIndex);
  }

  return otp;
}

export async function generateOTP() {
  const otp = otpBuilder();

  const otpExists = (
    await db
      .select()
      .from(otpVerification)
      .where(eq(otpVerification.otp, otp))
      .limit(1)
  )[0];
  if (otpExists) {
    return generateOTP();
  } else {
    return otp;
  }
}
