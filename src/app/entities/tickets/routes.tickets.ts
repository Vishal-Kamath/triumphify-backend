import validateResources, {
  blankSchema,
} from "@/app/middlewares/validateResources";
import { Router } from "express";
import { zticket, zticketChat } from "./validators.tickets";
import ticketControllers from "./controllers/index.tickets.controllers";

const router = Router();

router
  .route("/")
  .get(ticketControllers.handleGetAllTickets)
  .post(
    validateResources(blankSchema, zticket, blankSchema),
    ticketControllers.handleCreateTicket
  );

router.route("/:ticketId").get(ticketControllers.handleGetTicketById);
router
  .route("/:ticketId/chat")
  .get(ticketControllers.handleGetTicketChats)
  .post(
    validateResources(blankSchema, zticketChat, blankSchema),
    ticketControllers.handleChatWithOperator
  );

router
  .route("/:ticketId/chat/:chatId")
  .patch(
    validateResources(blankSchema, zticketChat, blankSchema),
    ticketControllers.handleUpdateChatTickets
  )
  .delete(ticketControllers.handleDeleteChatTickets);

export default router;
