import { Router } from "express";
import validateResources, {
  blankSchema,
} from "../../middlewares/validateResources";
import { employee, employeeId } from "./validators.employees";
import employeeControllers from "./controllers/index.employees.controller";

const router = Router();

router.get("/", employeeControllers.handleGetEmployees);
router.post(
  "/create",
  validateResources(blankSchema, employee, blankSchema),
  employeeControllers.handleCreateEmployee
);

router.get(
  "/details/:id",
  validateResources(employeeId, blankSchema, blankSchema),
  employeeControllers.handleFetchEmployeeDetailsForAdmin
);


export default router;
