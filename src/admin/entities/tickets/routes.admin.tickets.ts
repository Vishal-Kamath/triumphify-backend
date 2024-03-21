import validateResources, {
  blankSchema,
} from "@/app/middlewares/validateResources";
import { Router } from "express";
import ticketControllers from "./controllers/index.tickets.controllers";
import { zassigned } from "./validators.tickets";

const router = Router();

router
  .route("/:ticketId")
  .patch(
    validateResources(blankSchema, zassigned, blankSchema),
    ticketControllers.handleUpdateAssigned
  );

export default router;
