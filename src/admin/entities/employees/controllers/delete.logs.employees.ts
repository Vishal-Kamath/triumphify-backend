import { getRole } from "@/admin/utils/getRole";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { CSVLogger } from "@/utils/csv.logger";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";

const handleDeleteEmployeeLogs = async (
  req: Request<{ name: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { name } = req.params;
    const output = await CSVLogger.deleteLogs(name);

    if (output === "No logs found") {
      return res.status(404).send({
        description: `"${name}" not found`,
        type: "error",
      });
    }
    CSVLogger.succes(
      req.body.token.id,
      getRole(req.body.token.role),
      `delete employee logs "${name}"`
    );

    res.status(200).send({
      title: "Success",
      description: `employee logs "${name}" successfully deleted`,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle delete employee logs error", err);
    res
      .status(500)
      .json({ description: "internal server error", type: "error" });
  }
};

export default handleDeleteEmployeeLogs;
