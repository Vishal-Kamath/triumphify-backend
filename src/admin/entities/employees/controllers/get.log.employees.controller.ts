import { EmployeeLog } from "@/lib/@types/logs";
import { CSVLogger } from "@/utils/csv.logger";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";

const handleGetEmployeeLogs = async (
  req: Request<{ name: string }>,
  res: Response
) => {
  try {
    const { name } = req.params;

    const logs = (await CSVLogger.getLogs(name)) as
      | EmployeeLog[]
      | "No logs found";
    if (logs === "No logs found") {
      return res
        .status(404)
        .send({ description: "logs not found", type: "error" });
    }

    const filteredLogs = logs.sort(
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
