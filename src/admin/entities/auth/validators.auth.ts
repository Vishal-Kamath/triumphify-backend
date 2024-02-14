import z from "zod";

export const login = z.object({
  email: z.string().email().trim().min(1).max(100),
  password: z.string(),
});
export type ReqLogin = z.infer<typeof login>;

export const employeeEmail = z.object({
  email: z.string().email().trim().min(1).max(100),
});
export type EmployeeEmail = z.infer<typeof employeeEmail>;

export const resetPassword = z.object({
  password: z.string().trim().min(3).max(50),
  token: z.string().trim().min(1).max(1000),
  otp: z.string().min(7).max(7),
});
export type ResetPasswordType = z.infer<typeof resetPassword>;