import handleGetAllTickets from "./get.all.tickets.controllers";
import handleGetTicketById from "./get.byId.tickets.controller";
import handleUpdateAssigned from "./update.admin.assigned.controller";
import handleChatWithClient from "./chat.tickets.controllers";
import handleGetTicketChats from "./get.ticket.chats.controllers";
import handleDeleteChatTickets from "./delete.chat.tickets.controllers";
import handleUpdateChatTickets from "./update.chat.tickets.controllers";

export default {
  handleGetAllTickets,
  handleGetTicketById,
  handleUpdateAssigned,
  handleChatWithClient,
  handleGetTicketChats,
  handleDeleteChatTickets,
  handleUpdateChatTickets,
};
