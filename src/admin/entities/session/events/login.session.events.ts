import { Socket } from "socket.io";
import { parse } from "cookie";
import { verifyJwt } from "@/admin/utils/jwt.utils";
import EmployeeSessionManager from "../session.service.manager";

export const loginEvent = (socket: Socket) => {
  socket.on("login", () => {
    if (socket.handshake.headers.cookie) {
      const cookies = parse(socket.handshake.headers.cookie);
      const token = cookies["accessToken-admin"];
      const { decoded, expired, valid } = verifyJwt({
        key: "ACCESS_TOKEN_PUBLIC_ADMIN",
        token,
      });

      if (decoded && !expired && valid) {
        EmployeeSessionManager.initService(socket, decoded.token.id);
        socket.emit("loggedIn");
      } else {
        socket.emit("unauthorized");
      }
    } else {
      socket.emit("unauthorized");
    }
  });
};
