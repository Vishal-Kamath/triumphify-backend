import { EmployeeLog } from "@/lib/@types/logs";
import { CSVLogger } from "@/utils/csv.logger";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";

const handleGetEmployeeLogs = async (
  req: Request<{ name: string }, {}, {}, { start: string; end: string }>,
  res: Response
) => {
  try {
    const { name } = req.params;
    const end_date = req.query.end ? new Date(req.query.end) : new Date();
    const start_date = req.query.start
      ? new Date(req.query.start)
      : new Date(
          new Date(end_date).setMonth(new Date(end_date).getMonth() - 1)
        );
    end_date.setHours(23, 59, 59, 999);
    start_date.setHours(0, 0, 0, 0);

    const logs = (await CSVLogger.getLogs(name)) as
      | EmployeeLog[]
      | "No logs found";
    if (logs === "No logs found") {
      return res
        .status(404)
        .send({ description: "logs not found", type: "error" });
    }

    const filteredLogs = logs
      .filter((log) => {
        return (
          new Date(log.created_at) >= start_date &&
          new Date(log.created_at) <= end_date
        );
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    res.status(200).send({
      data: filteredLogs,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get employee log error", err);
    res
      .status(500)
      .json({ description: "internal server error", type: "error" });
  }
};

export default handleGetEmployeeLogs;
