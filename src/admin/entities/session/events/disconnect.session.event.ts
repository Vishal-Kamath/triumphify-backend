import { Socket } from "socket.io";
import EmployeeSessionManager from "../session.service.manager";

export const disconnect = (socket: Socket) => {
  socket.on("disconnect", () => {
    EmployeeSessionManager.endSession(socket.id);
  });
};
