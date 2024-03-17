import handleCreateEmployee from "./create.employees.controller";
import handleGetEmployees from "./get.employees..controller";
import handleGetEmployeeDetails from "./get.details.employees.controller";
import handleFetchEmployeeDetailsForAdmin from "./get.details.admin.employees.controller";
import handleUpdateEmployee from "./update.employee.controller";
import handleUpdateEmployeePassword from "./updatePassword.employee.controller";

import handleGetAllEmployeeLogsList from "./get.logs.list.employees.controller";
import handleGetEmployeeLogs from "./get.log.employees.controller";
import handleDeleteEmployeeLogs from "./delete.logs.employees";

import handleActivateDeactivateEmployee from "./activate.deactivate.superadmin.employees.controller";
import handleGetPrivilages from "./get.privilages.controller";
import handleUpdateRole from "./update.superadmin.employees.controller";

export default {
  handleCreateEmployee,
  handleGetEmployees,
  handleGetEmployeeDetails,
  handleFetchEmployeeDetailsForAdmin,
  handleUpdateEmployee,
  handleUpdateEmployeePassword,

  handleGetAllEmployeeLogsList,
  handleGetEmployeeLogs,
  handleDeleteEmployeeLogs,

  handleActivateDeactivateEmployee,

  handleGetPrivilages,
  handleUpdateRole,
};
