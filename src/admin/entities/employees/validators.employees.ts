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
  role: z.enum(["admin", "employee"]),
});
export type ReqEmployee = z.infer<typeof employee>;

export const employeeWithPassword = employee.merge(
  z.object({
    password: z.string().trim().min(3).max(50),
  })
);
export type ReqEmployeeWithPassword = z.infer<typeof employeeWithPassword>;

export const employeeUsername = z.object({
  username: z.string().max(50).min(3),
});
export type EmployeeUsername = z.infer<typeof employeeUsername>;
export const employeeEmail = z.object({
  email: z.string().email().trim().min(1).max(100),
});
export type EmployeeEmail = z.infer<typeof employeeEmail>;


export const employeePassword = z.object({
  currentPassword: z.string().trim().min(3).max(50),
  newPassword: z.string().trim().min(3).max(50),
});
export type EmployeePassword = z.infer<typeof employeePassword>;
