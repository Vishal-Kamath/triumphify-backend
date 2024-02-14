import { isUser18Plus } from "@/app/utils/isUser18Plus";
import { TypeOf, z } from "zod";

export const userDetailsSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().email().trim().min(1).max(100),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .refine((dob) => {
      return new Date(dob).getTime() < Date.now();
    })
    .refine((dob) => {
      return isUser18Plus(dob);
    }, "You must be 18 years or older"),
});
export type UserDetailsType = z.infer<typeof userDetailsSchema>;

export const userUpdatePassword = z.object({
  currentPassword: z.string().trim().min(3).max(50),
  newPassword: z.string().trim().min(3).max(50),
});
export type UserUpdatePasswordType = z.infer<typeof userUpdatePassword>;

export const userVerifyEmailOtp = z.object({
  code: z.string().min(7).max(7),
});
export type UserVerifyEmailOtpType = TypeOf<typeof userVerifyEmailOtp>;
