import handleGetAdminConversationsEvent from "./get.admin.conversations";
import handleGetConversationsEvent from "./get.conversations";
import handleGetRoomEvent from "./get.room.admin";
import handleInitChatEvents from "./login.chat.events";
import { logoutEvent } from "./logout.session.event";
import handleNewAdminChatEvent from "./new.admin.chat.events";
import handleNewChatEvent from "./new.chat.events";
import handleTerminateRoomAdminEvent from "./terminate.chat.admin.event";
import handleUpdateAdminChatEvent from "./update.admin.chat.events";
import handleUpdateChatEvent from "./update.chat.events";

export default {
  handleInitChatEvents,
  handleNewChatEvent,
  handleUpdateChatEvent,
  handleGetConversationsEvent,
  logoutEvent,

  // admin
  handleGetAdminConversationsEvent,
  handleNewAdminChatEvent,
  handleUpdateAdminChatEvent,
  handleGetRoomEvent,
  handleTerminateRoomAdminEvent,
};
