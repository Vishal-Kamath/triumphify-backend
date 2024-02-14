import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { removeTokens } from "../utils/auth";

const handleSignOut = async (req: Request, res: Response) => {
  try {
    removeTokens(res);
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
