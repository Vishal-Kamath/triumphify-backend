import { Router } from "express";
import leadsController from "./controllers/index.leads.controllers";
import validateResources, {
  blankSchema,
} from "@/admin/middlewares/validateResources";
import { updateLead } from "./validators.leads";

const router = Router();

router.get("/", leadsController.handleGetAllLeads);
router.post(
  "/employee/:leadId",
  validateResources(blankSchema, updateLead, blankSchema),
  leadsController.handleUpdateLeadEmployee
);

export default router;
