import { Router } from "express";
import leadsController from "./controllers/index.leads.controllers";
import validateResources, {
  blankSchema,
} from "@/admin/middlewares/validateResources";
import { updateLead } from "./validators.leads";

const router = Router();

router
  .route("/:leadId")
  .post(
    validateResources(blankSchema, updateLead, blankSchema),
    leadsController.handleUpdateLead
  )
  .delete(leadsController.handleDeleteLeads);

export default router;
