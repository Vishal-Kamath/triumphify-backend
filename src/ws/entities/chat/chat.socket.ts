import { Server as HTTPServerType } from "http";
import { Server, Socket } from "socket.io";
import { env } from "@/config/env.config";
import chatEvents from "./events/index.chat.events";
import { parse } from "cookie";
import { verifyJwt } from "@/ws/utils/jwt.utils";
import { instrument } from "@socket.io/admin-ui";

function chatSocket(server: HTTPServerType) {
  const io = new Server(server, {
    cors: {
      origin: [
        env.WEBSITE,
        env.APP_WEBSITE,
        env.ADMIN_WEBSITE,
        env.ADMIN_ENDPOINT,
      ],
      credentials: true,
    },
    cookie: true,
  });

  io.on("connection", (socket) => {
    chatEvents.handleInitChatEvents(socket);
    chatEvents.logoutEvent(socket);

    const { isAdmin, adminPayload, isUser, userPayload } = getPayLoad(socket);
    if (!isAdmin && !isUser) return;

    if (isUser && userPayload) {
      chatEvents.handleNewChatEvent(socket, userPayload);
      chatEvents.handleUpdateChatEvent(socket, userPayload);
      chatEvents.handleGetConversationsEvent(socket, userPayload);
    }

    if (isAdmin && adminPayload) {
      chatEvents.handleNewAdminChatEvent(socket, adminPayload);
      chatEvents.handleUpdateAdminChatEvent(socket, adminPayload);
      chatEvents.handleGetAdminConversationsEvent(socket);
      chatEvents.handleGetRoomEvent(socket);
      chatEvents.handleTerminateRoomAdminEvent(socket, adminPayload);
    }
  });

  instrument(io, { auth: false });
}

function getPayLoad(socket: Socket) {
  const {
    decoded: adDecoded,
    expired: adExpired,
    valid: adValid,
  } = getPayLoadAdmin(socket);
  const { decoded, expired, valid } = getPayLoadUser(socket);

  const isAdmin = adDecoded && !adExpired && adValid;
  const isUser = decoded && !expired && valid;

  return { isAdmin, isUser, userPayload: decoded, adminPayload: adDecoded };
}

function getPayLoadUser(socket: Socket) {
  if (!socket.handshake.headers.cookie)
    return { decoded: null, expired: true, valid: false };
  const cookies = parse(socket.handshake.headers.cookie);
  const token = cookies["accessToken"];
  const { decoded, expired, valid } = verifyJwt({
    key: "ACCESS_TOKEN_PUBLIC",
    token,
  });

  if (decoded && !expired && valid) return { decoded, expired, valid };
  return { decoded, expired, valid };
}

function getPayLoadAdmin(socket: Socket) {
  if (!socket.handshake.headers.cookie)
    return { decoded: null, expired: true, valid: false };
  const cookies = parse(socket.handshake.headers.cookie);
  const token = cookies["accessToken-admin"];
  const { decoded, expired, valid } = verifyJwt({
    key: "ACCESS_TOKEN_PUBLIC_ADMIN",
    token,
  });

  if (decoded && !expired && valid) return { decoded, expired, valid };
  return { decoded, expired, valid };
}

export default chatSocket;
