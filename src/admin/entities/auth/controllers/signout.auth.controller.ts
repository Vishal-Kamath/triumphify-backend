import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { removeTokens } from "../utils/auth";
import { CSVLogger } from "@/utils/csv.logger";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { getRole } from "@/admin/utils/getRole";

const handleSignOut = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    removeTokens(res);
    CSVLogger.info(
      req.body.token.id,
      getRole(req.body.token.role),
      "User logged out"
    );
    return res.status(200).send({
      title: "Logged Out!!",
      description: "successfully logged out",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle SignOut error", err);
    return res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleSignOut;
