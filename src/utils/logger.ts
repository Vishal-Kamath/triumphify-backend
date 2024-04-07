import chalk from "chalk";
import dayjs from "dayjs";
import _ from "lodash";

function omit(object: any, fields: string[]): any {
  if (!_.isObject(object)) {
    return object;
  }

  if (_.isArray(object)) {
    return object.map((item) => omit(item, fields));
  }

  const omitKeys2D = fields
    .map((key) =>
      Object.keys(object).filter((k) =>
        k.toLowerCase().includes(key.toLowerCase())
      )
    )
    .flat();
  const modifiedObject = _.omit(object, omitKeys2D);

  _.forOwn(modifiedObject, (value, key) => {
    // @ts-ignore
    modifiedObject[key] = omit(value, fields);
  });

  return modifiedObject;
}

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
    // omit if privlages
    if (req.originalUrl.includes("/api/employees/privilages")) {
      next();
      return;
    }
    console.log(
      `[${chalk.gray.bold("REQ")}]:[${chalk.gray(dayjs().format())}]:${
        req.method
      } ${req.originalUrl} IP-${req.ip}${
        req.body &&
        JSON.stringify(omit(req.body, ["password", "base64"])) !== "{}"
          ? `\n${JSON.stringify(
              omit(req.body, ["password", "base64"]),
              null,
              2
            )}`
          : ""
      }`
    );
    next();
  }
}
