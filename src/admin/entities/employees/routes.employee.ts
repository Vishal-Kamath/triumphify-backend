import { Router } from "express";
import employeeControllers from "./controllers/index.employees.controller";
import validateResources, {
  blankSchema,
} from "@/admin/middlewares/validateResources";
import {
  employeeEmail,
  employeePassword,
  employeePrivilage,
  employeeUsername,
} from "./validators.employees";

const router = Router();

router.get("/details", employeeControllers.handleGetEmployeeDetails);
router.post(
  "/privilages",
  validateResources(blankSchema, employeePrivilage, blankSchema),
  employeeControllers.handleGetPrivilages
);

router.patch(
  "/update/username",
  validateResources(blankSchema, employeeUsername, blankSchema),
  employeeControllers.handleUpdateEmployeeUsername
);
router.patch(
  "/update/email",
  validateResources(blankSchema, employeeEmail, blankSchema),
  employeeControllers.handleUpdateEmployeeEmail
);
router.put(
  "/update/password",
  validateResources(blankSchema, employeePassword, blankSchema),
  employeeControllers.handleUpdateEmployeePassword
);

export default router;
