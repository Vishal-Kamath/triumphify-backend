import { Logger } from "@/utils/logger";
import { EmployeeSessionService } from "./session.service";
import { v4 as uuid } from "uuid";
import { Socket } from "socket.io";
import { forEach } from "lodash";
import { convertUTCDateToLocalDate } from "@/utils/getUTCDate";

interface Service {
  service_id: string;
  service: EmployeeSessionService;
  concurent: Record<string, Socket>;
  time: number;
  timer?: NodeJS.Timeout;
}
class EmployeeSessionManager {
  private static services: Record<string, Service> = {};

  static initService(socket: Socket, employee_id: string) {
    if (!this.services[employee_id]) {
      const service_id = uuid();
      this.services[employee_id] = {
        service_id,
        service: new EmployeeSessionService(service_id, employee_id),
        time: 0,
        concurent: {
          [socket.id]: socket,
        },
      };

      this.initTimer(socket);
      Logger.info(
        `EmployeeSessionManager: Service initialized for ${employee_id} with session_id ${socket.id}`
      );
    } else {
      this.services[employee_id].concurent[socket.id] = socket;
      Logger.info(
        `EmployeeSessionManager: Session ${socket.id} added to ${employee_id}`
      );
    }
  }

  static getService(session_id: string) {
    return Object.values(this.services).find((service) => {
      return Object.keys(service.concurent).includes(session_id);
    });
  }

  static async endService(session_id: string) {
    const service = this.getService(session_id);
    if (!service) return;

    await service.service.updateTime(service.time);
    await service.service.endSession();
    service.timer && clearInterval(service.timer);
    delete this.services[service.service.getEmployeeId()];
    Logger.info(
      `EmployeeSessionManager: Service ended for ${service.service.getEmployeeId()}`
    );
  }

  static async endSession(session_id: string) {
    const service = this.getService(session_id);
    if (!service) return;

    delete service.concurent[session_id];
    Logger.info(`EmployeeSessionManager: Session ${session_id} ended`);

    if (Object.keys(service.concurent).length === 0) {
      await service.service.updateTime(service.time);
      await service.service.endSession();
      service.timer && clearInterval(service.timer);
      delete this.services[service.service.getEmployeeId()];
      Logger.info(
        `EmployeeSessionManager: Service ended for ${service.service.getEmployeeId()}`
      );
    }
  }

  static async timeEventEmitter(employee_id: string) {
    const service = this.services[employee_id];
    if (!service) return;

    service.time += 1;
    const nextDay =
      convertUTCDateToLocalDate(new Date()) !== service.service.getDate();

    // if next day
    if (nextDay) {
      await service.service.updateTime(service.time);
      service.time = 0;
      await service.service.endSession();

      // create new service
      const service_id = uuid();
      service.service = new EmployeeSessionService(service_id, employee_id);
      service.service_id = service_id;
    }

    Object.values(service.concurent).map((socket) => {
      socket.emit("time", service.time);
    });

    // update every 15 min
    if (service.time % (15 * 60) === 0) {
      service.service.updateTime(service.time);
    }
  }
  static initTimer(socket: Socket) {
    const service = this.getService(socket.id);
    if (!service) return;

    service.timer = setInterval(
      () => this.timeEventEmitter(service.service.getEmployeeId()),
      1000
    );
  }

  static async clearAll() {
    for (const service of Object.values(this.services)) {
      await service.service.updateTime(service.time);
      await service.service.endSession();
      service.timer && clearInterval(service.timer);
    }
    this.services = {};
    Logger.info(`EmployeeSessionManager: All services cleared`);
    return;
  }
}

export default EmployeeSessionManager;
