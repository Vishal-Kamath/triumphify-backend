import z from "zod";

export const employeePrivilage = z.object({
  path: z.string().min(1).max(100),
});

export const employeeId = z.object({
  id: z.string().uuid(),
});

export const employee = z.object({
  email: z.string().email().trim().min(1).max(100),
  username: z.string().max(50).min(3),
  password: z.string().max(50).min(3),
  role: z.enum(["admin", "employee"]),
});
export type ReqEmployee = z.infer<typeof employee>;

export const employeedetails = z.object({
  email: z.string().email().trim().min(1).max(100),
  username: z.string().max(50).min(3),
});
export type Employeedetails = z.infer<typeof employeedetails>;

export const employeeRole = z.object({
  role: z.enum(["admin", "employee"]),
});
export type EmployeeRole = z.infer<typeof employeeRole>;

export const employeePassword = z.object({
  currentPassword: z.string().trim().min(3).max(50),
  newPassword: z.string().trim().min(3).max(50),
});
export type EmployeePassword = z.infer<typeof employeePassword>;
