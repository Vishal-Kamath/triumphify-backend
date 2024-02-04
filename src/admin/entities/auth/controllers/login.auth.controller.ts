import { Request, Response } from "express";
import { Logger } from "@/utils/logger";
import { ReqLogin } from "../validators.auth";

const handleLogin = async (req: Request<{}, {}, ReqLogin>, res: Response) => {
  try {
    const { username, password } = req.body;
  } catch (err) {
    Logger.error("handle Login error", err);
    return res
      .status(500)
      .send({ message: "Internal server error", type: "error" });
  }
};
