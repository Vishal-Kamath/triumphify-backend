import validateResources, {
  blankSchema,
} from "@/app/middlewares/validateResources";
import { Router } from "express";
import { zticket } from "./validators.tickets";
import ticketControllers from "./controllers/index.tickets.controllers";

const router = Router();

router
  .route("/")
  .post(
    validateResources(blankSchema, zticket, blankSchema),
    ticketControllers.handleCreateTicket
  );

export default router;
