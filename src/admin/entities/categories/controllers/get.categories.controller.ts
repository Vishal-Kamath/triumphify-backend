import { Logger } from "@/utils/logger";
import { Request, Response } from "express";

const handleGetCategory = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    Logger.error("handle get Category error: ", err);
    res.status(500).send("Internal server error");
  }
};
