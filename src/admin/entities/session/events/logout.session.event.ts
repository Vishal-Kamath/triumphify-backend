import { Socket } from "socket.io";
import EmployeeSessionManager from "../session.service.manager";

export const logoutEvent = (socket: Socket) => {
  socket.on("logout", () => {
    EmployeeSessionManager.endService(socket.id);
    socket.emit("loggedOut");
  });
};
