import { Router } from "express";
import leadsController from "./controllers/index.leads.controllers";

const router = Router();

router.post("/:leadId", leadsController.handleUpdateLead);

export default router;
