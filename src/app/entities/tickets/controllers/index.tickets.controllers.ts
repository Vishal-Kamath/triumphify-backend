import handleCreateTicket from "./create.ticket";
import handleGetAllTickets from "./get.all.tickets.controllers";
import handleUpdateChatTickets from "./update.chat.tickets.controllers";
import handleDeleteChatTickets from "./delete.chat.tickets.controllers";
import handleGetTicketById from "./get.byId.tickets.controller";
import handleGetTicketChats from "./get.ticket.chats.controllers";
import handleChatWithOperator from "./chat.tickets.controllers";

export default {
  handleCreateTicket,
  handleGetAllTickets,
  handleUpdateChatTickets,
  handleDeleteChatTickets,
  handleGetTicketById,
  handleGetTicketChats,
  handleChatWithOperator,
};
