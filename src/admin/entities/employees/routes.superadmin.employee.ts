import { Router } from "express";
import validateResources, {
  blankSchema,
} from "../../middlewares/validateResources";
import { employee, employeeId } from "./validators.employees";
import employeeControllers from "./controllers/index.employees.controller";

const router = Router();

router.post(
  "/create",
  validateResources(blankSchema, employee, blankSchema),
  employeeControllers.handleCreateEmployee
);

router
  .route("/details/:id")
  .get(
    validateResources(employeeId, blankSchema, blankSchema),
    employeeControllers.handleFetchEmployeeDetailsForAdmin
  )
  .post(
    validateResources(employeeId, employee, blankSchema),
    employeeControllers.handleUpdateSuperadmin
  );

router.get(
  "/:id/status/:status",
  employeeControllers.handleActivateDeactivateEmployee
);

router.get("/logs", employeeControllers.handleGetAllEmployeeLogsList);
router
  .route("/logs/:name")
  .get(employeeControllers.handleGetEmployeeLogs)
  .delete(employeeControllers.handleDeleteEmployeeLogs);

export default router;
