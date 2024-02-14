import chalk from "chalk";
import dayjs from "dayjs";
import _ from "lodash";

export class Logger {
  static error(...msg: any[]) {
    console.log(
      `[${chalk.red.bold("ERROR")}]:[${chalk.gray(dayjs().format())}]:${msg
        .map((val) => String(val))
        .join(" ")}`
    );
  }
  static warn(...msg: any[]) {
    console.log(
      `[${chalk.yellow.bold("WARN")}]:[${chalk.gray(dayjs().format())}]:${msg
        .map((val) => String(val))
        .join(" ")}`
    );
  }
  static info(...msg: any[]) {
    console.log(
      `[${chalk.cyan.bold("INFO")}]:[${chalk.gray(dayjs().format())}]:${msg
        .map((val) => String(val))
        .join(" ")}`
    );
  }
  static success(...msg: any[]) {
    console.log(
      `[${chalk.green.bold("SUCCESS")}]:[${chalk.gray(dayjs().format())}]:${msg
        .map((val) => String(val))
        .join(" ")}`
    );
  }

  // request log
  static requestLogger(req: any, res: any, next: any) {
    console.log(
      `[${chalk.gray.bold("REQ")}]:[${chalk.gray(dayjs().format())}]:${
        req.method
      } ${req.originalUrl} IP-${req.ip}${
        req.body &&
        JSON.stringify(
          _.omit(req.body, ["password", "newPassword", "currentPassword"])
        ) !== "{}"
          ? `\n${JSON.stringify(
              _.omit(req.body, ["password", "newPassword", "currentPassword"]),
              null,
              2
            )}`
          : ""
      }`
    );
    next();
  }
}
