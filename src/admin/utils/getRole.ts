import { env } from "@/config/env.config";

export const getRole = (role: string) => {
  if (role === env.ADMIN) return "admin";
  if (role === env.SUPERADMIN) return "superadmin";
  if (role === env.EMPLOYEE) return "employee";
  return "employee";
};
