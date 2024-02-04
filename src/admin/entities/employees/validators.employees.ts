import z from "zod";

export const employee = z.object({
  username: z.string().max(50).min(3),
  password: z.string().max(50).min(3),
  role: z.enum(["admin", "employee"]),
});
export type ReqEmployee = z.infer<typeof employee>;
