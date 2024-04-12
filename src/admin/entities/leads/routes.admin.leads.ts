import { Router } from "express";
import leadsController from "./controllers/index.leads.controllers";
import validateResources, {
  blankSchema,
} from "@/admin/middlewares/validateResources";
import { triggerAction, updateLead } from "./validators.leads";

const router = Router();

router.get("/actions", leadsController.handleGetAllActions);
router.post(
  "/actions/trigger",
  validateResources(blankSchema, triggerAction, blankSchema),
  leadsController.handleTriggerAction
);
router
  .route("/actions/:actionId")
  .get(leadsController.handleGetByIdAction)
  .put(leadsController.handleUpdateAction)
  .delete(leadsController.handleDeleteAction);

router
  .route("/:leadId")
  .post(
    validateResources(blankSchema, updateLead, blankSchema),
    leadsController.handleUpdateLead
  )
  .delete(leadsController.handleDeleteLeads);

export default router;
