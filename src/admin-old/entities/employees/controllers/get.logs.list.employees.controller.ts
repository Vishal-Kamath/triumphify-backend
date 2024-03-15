import { CSVLogger } from "@/utils/csv.logger";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";

const handleGetAllEmployeeLogsList = async (req: Request, res: Response) => {
  try {
    const list = await CSVLogger.getLogsList();

    return res.status(200).send({
      data: list,
      type: "success",
    });
  } catch (err) {
    Logger.error("Get All Employee Logs List", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllEmployeeLogsList;
