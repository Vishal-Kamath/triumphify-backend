import { Logger } from "@/utils/logger";
import { Request, Response } from "express";

const handleSearchByCategoryFilters = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    Logger.error("handle search by category filters error", err);
    return res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleSearchByCategoryFilters;
