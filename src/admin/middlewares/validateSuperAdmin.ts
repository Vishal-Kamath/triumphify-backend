import { Logger } from "@/utils/logger";
import { NextFunction, Request, Response } from "express";
import { TokenPayload } from "../utils/jwt.utils";
import { getRole } from "../utils/getRole";

const validateSuperAdmin = (
  req: Request<{}, {}, TokenPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (getRole(req.body.token.role) === "superadmin") {
      return next();
    } else {
      return res.status(401).send({
        title: "Unauthorized",
        description: "Unauthorized",
        type: "error",
      });
    }
  } catch (err) {
    Logger.error("validate admin error", err);
    return res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default validateSuperAdmin;
