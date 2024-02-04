import { Router } from "express";
import validateResources, {
  blankSchema,
} from "../../middlewares/validateResources";
import { employee } from "./validators.employees";
import employeeControllers from "./controllers/index.employees.controller";

const router = Router();

router.get("/", employeeControllers.handleGetEmployees);
router.post(
  "/create",
  validateResources(blankSchema, employee, blankSchema),
  employeeControllers.handleCreateEmployee
);

export default router;
