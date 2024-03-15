import { isUser18Plus } from "@/app/utils/isUser18Plus";
import z from "zod";

export const SignupSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().email().trim().min(1).max(100),
  tel: z
    .string()
    .max(100)
    // .refine((val) => val.toString().length > 9, "Incorrect phone number")
    .refine((val) => !Number.isNaN(Number(val)), "Invalid input"),
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
  password: z.string().trim().min(3).max(50),
});
export type SignupType = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: z.string().email().min(1).max(100),
  password: z.string().trim().min(3).max(50),
});
export type LoginType = z.infer<typeof LoginSchema>;

export const userEmail = z.object({
  email: z.string().email().trim().min(1).max(100),
});
export type UserEmail = z.infer<typeof userEmail>;

export const resetPassword = z.object({
  password: z.string().trim().min(3).max(50),
  token: z.string().trim().min(1).max(1000),
  otp: z.string().min(7).max(7),
});
export type ResetPasswordType = z.infer<typeof resetPassword>;
