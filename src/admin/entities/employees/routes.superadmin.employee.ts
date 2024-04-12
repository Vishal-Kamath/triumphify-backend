import { Router } from "express";
import validateResources, {
  blankSchema,
} from "../../middlewares/validateResources";
import {
  employee,
  employeeId,
  employeeWithPassword,
  rateSchema,
} from "./validators.employees";
import employeeControllers from "./controllers/index.employees.controller";

const router = Router();

router.post(
  "/create",
  validateResources(blankSchema, employeeWithPassword, blankSchema),
  employeeControllers.handleCreateEmployee
);

router.get("/superadmins", employeeControllers.handleGetAllSuperadminDetails);

router
  .route("/details/:id")
  .get(
    validateResources(employeeId, blankSchema, blankSchema),
    employeeControllers.handleFetchEmployeeDetailsForAdmin
  )
  .post(
    validateResources(employeeId, employee, blankSchema),
    employeeControllers.handleUpdateSuperadmin
  )
  .patch(
    validateResources(employeeId, rateSchema, blankSchema),
    employeeControllers.handleEmployeeRateUpdateBySuperAdmin
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
