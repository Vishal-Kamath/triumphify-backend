import { Router } from "express";
import sessionControllers from "./controllers/index.session.controllers";

const router = Router();

router.get("/:employeeId", sessionControllers.handleGetEmployeeSession);

export default router;
