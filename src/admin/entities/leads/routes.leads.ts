import { Router } from "express";
import leadsController from "./controllers/index.leads.controllers";

const router = Router();

router.get("/", leadsController.handleGetAllLeads);

export default router;
