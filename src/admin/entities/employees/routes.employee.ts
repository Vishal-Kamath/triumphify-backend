import { Router } from "express";
import employeeControllers from "./controllers/index.employees.controller";
import validateResources, {
  blankSchema,
} from "@/admin/middlewares/validateResources";
import {
  employeePassword,
  employeePrivilage,
  employeedetails,
} from "./validators.employees";

const router = Router();

router.get("/details", employeeControllers.handleGetEmployeeDetails);
router.post(
  "/privilages",
  validateResources(blankSchema, employeePrivilage, blankSchema),
  employeeControllers.handleGetPrivilages
);

router.put(
  "/update",
  validateResources(blankSchema, employeedetails, blankSchema),
  employeeControllers.handleUpdateEmployee
);
router.put(
  "/update/password",
  validateResources(blankSchema, employeePassword, blankSchema),
  employeeControllers.handleUpdateEmployeePassword
);

export default router;
