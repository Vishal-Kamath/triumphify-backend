import handleCreateEmployee from "./create.employees.controller";
import handleGetEmployees from "./get.employees..controller";
import handleGetEmployeeDetails from "./get.details.employees.controller";
import handleFetchEmployeeDetailsForAdmin from "./get.details.admin.employees.controller";
import handleUpdateEmployeeEmail from "./update.email.employee.controller";
import handleUpdateEmployeeUsername from "./update.username.employee.controller";
import handleUpdateEmployeePassword from "./updatePassword.employee.controller";

import handleGetAllEmployeeLogsList from "./get.logs.list.employees.controller";
import handleGetEmployeeLogs from "./get.log.employees.controller";
import handleDeleteEmployeeLogs from "./delete.logs.employees";

import handleActivateDeactivateEmployee from "./activate.deactivate.superadmin.employees.controller";
import handleGetPrivilages from "./get.privilages.controller";
import handleUpdateSuperadmin from "./update.superadmin.employees.controller";

import handleGetAllSuperadminDetails from "./getall.superadmin.details.employee.controller";
import handleEmployeeRateUpdateBySuperAdmin from "./update.rate.employee.superadmin.controller";

export default {
  handleCreateEmployee,
  handleGetEmployees,
  handleGetEmployeeDetails,
  handleFetchEmployeeDetailsForAdmin,
  handleUpdateEmployeeEmail,
  handleUpdateEmployeeUsername,
  handleUpdateEmployeePassword,

  handleGetAllEmployeeLogsList,
  handleGetEmployeeLogs,
  handleDeleteEmployeeLogs,

  handleActivateDeactivateEmployee,

  handleGetPrivilages,
  handleUpdateSuperadmin,

  handleGetAllSuperadminDetails,
  handleEmployeeRateUpdateBySuperAdmin,
};
