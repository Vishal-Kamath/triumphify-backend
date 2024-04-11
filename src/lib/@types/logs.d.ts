export interface EmployeeLog {
  id: string;
  employee_id: string;
  employee_role: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  created_at: Date;
}
