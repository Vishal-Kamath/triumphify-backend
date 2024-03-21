import { zstatus, zticketChat } from "./validators.tickets";
import validateResources, {
  blankSchema,
} from "@/app/middlewares/validateResources";
import { Router } from "express";
import ticketControllers from "./controllers/index.tickets.controllers";

const router = Router();

router.route("/").get(ticketControllers.handleGetAllTickets);
router
  .route("/:ticketId")
  .put(
    validateResources(blankSchema, zstatus, blankSchema),
    ticketControllers.handleUpdateTicketStatus
  )
  .get(ticketControllers.handleGetTicketById);
router
  .route("/:ticketId/chat")
  .get(ticketControllers.handleGetTicketChats)
  .post(
    validateResources(blankSchema, zticketChat, blankSchema),
    ticketControllers.handleChatWithClient
  );

router
  .route("/:ticketId/chat/:chatId")
  .patch(
    validateResources(blankSchema, zticketChat, blankSchema),
    ticketControllers.handleUpdateChatTickets
  )
  .delete(ticketControllers.handleDeleteChatTickets);

export default router;
