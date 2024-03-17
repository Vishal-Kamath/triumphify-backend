import { Router } from "express";
import employeeControllers from "./controllers/index.employees.controller";

const router = Router();

router.get("/", employeeControllers.handleGetEmployees);

export default router;
