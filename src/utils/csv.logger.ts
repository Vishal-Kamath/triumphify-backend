import fs from "fs";
import { v4 as uuid } from "uuid";
import path from "path";
import csv from "csvtojson";

const months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

function convertFileSize(sizeInBytes: number) {
  const KB = 1024;
  const MB = KB * 1024;

  if (sizeInBytes < KB) {
    return sizeInBytes + " bytes";
  } else if (sizeInBytes < MB) {
    return (sizeInBytes / KB).toFixed(2) + " KB";
  } else {
    return (sizeInBytes / MB).toFixed(2) + " MB";
  }
}

export class CSVLogger {
  private static logsdir = path.join(__dirname, "..", "..", "logs");
  static getLogPath(
    month = months[new Date().getMonth()],
    year = new Date().getFullYear()
  ) {
    const logpath = path.join(
      this.logsdir,
      `employee_logs_${month}_${year}.csv`
    );

    if (!fs.existsSync(logpath)) {
      fs.writeFileSync(
        logpath,
        "id, employee_id, employee_role, message, type, created_at\n",
        "utf-8"
      );
    }
    return logpath;
  }

  static async getLogsList() {
    const listOfNames = fs.readdirSync(this.logsdir);
    const filteredList = listOfNames
      .filter((name) => name.endsWith(".csv"))
      .map((name) => path.join(this.logsdir, name));

    const stats = filteredList.map((filePath) => {
      const stat = fs.statSync(filePath);
      return {
        name: path.basename(filePath),
        size: convertFileSize(stat.size),
        createdAt: stat.birthtime,
      };
    });
    return stats;
  }

  static async getLogs(name: string) {
    const logpath = path.join(this.logsdir, name);

    if (!fs.existsSync(logpath)) {
      return "No logs found";
    }

    return await csv()
      .fromFile(logpath)
      .then((jsonObj) => jsonObj);
  }

  static async deleteLogs(name: string) {
    const logpath = path.join(this.logsdir, name);

    if (!fs.existsSync(logpath)) {
      return "No logs found";
    }

    fs.unlinkSync(logpath);
    return "Success";
  }

  static async succes(
    employee_id: string,
    employee_role: string,
    ...msg: any[]
  ) {
    const logpath = this.getLogPath();
    const id = uuid();
    const created_at = new Date().toString();
    const log = `${id}, ${employee_id}, ${employee_role}, ${msg
      .map((val) => String(val))
      .join(" ")
      .replaceAll(",", "")}, success, ${created_at}\n`;

    fs.appendFileSync(logpath, log, "utf-8");
  }

  static async warning(
    employee_id: string,
    employee_role: string,
    ...msg: any[]
  ) {
    const logpath = this.getLogPath();
    const id = uuid();
    const created_at = new Date().toString();
    const log = `${id}, ${employee_id}, ${employee_role}, ${msg
      .map((val) => String(val))
      .join(" ")
      .replaceAll(",", "")}, warning, ${created_at}\n`;

    fs.appendFileSync(logpath, log, "utf-8");
  }

  static async error(
    employee_id: string,
    employee_role: string,
    ...msg: any[]
  ) {
    const logpath = this.getLogPath();
    const id = uuid();
    const created_at = new Date().toString();
    const log = `${id}, ${employee_id}, ${employee_role}, ${msg
      .map((val) => String(val))
      .join(" ")
      .replaceAll(",", "")}, error, ${created_at}\n`;

    fs.appendFileSync(logpath, log, "utf-8");
  }

  static async info(employee_id: string, employee_role: string, ...msg: any[]) {
    const logpath = this.getLogPath();
    const id = uuid();
    const created_at = new Date().toString();
    const log = `${id}, ${employee_id}, ${employee_role}, ${msg
      .map((val) => String(val))
      .join(" ")
      .replaceAll(",", "")}, info, ${created_at}\n`;

    fs.appendFileSync(logpath, log, "utf-8");
  }
}
