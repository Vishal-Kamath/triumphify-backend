import { env } from "@/config/env.config";

export const getRoleEnv = (role: "employee" | "admin" | "superadmin") => {
  if (role === "admin") return env.ADMIN;
  if (role === "superadmin") return env.SUPERADMIN;
  if (role === "employee") return env.EMPLOYEE;
  return env.EMPLOYEE;
};

export const getRole = (role: string) => {
  if (role === env.ADMIN) return "admin";
  if (role === env.SUPERADMIN) return "superadmin";
  if (role === env.EMPLOYEE) return "employee";
  return "employee";
};
