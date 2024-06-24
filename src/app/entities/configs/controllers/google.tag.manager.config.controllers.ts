import { Request, Response } from "express";
import { Logger } from "@/utils/logger";
import { db } from "@/lib/db";
import { websiteConfigs } from "@/lib/db/schema/config";
import { eq } from "drizzle-orm";

export const handleGetGoogleTagMangerConfig = async (
  req: Request,
  res: Response
) => {
  try {
    const getGTMTag = (
      await db
        .select()
        .from(websiteConfigs)
        .where(eq(websiteConfigs.type, "google_tag_manager"))
        .limit(1)
    )[0];
    if (!getGTMTag) {
      return res.status(404).send({
        description: "Google tag manager config not found",
        type: "warning",
      });
    }

    res.json({
      data: getGTMTag.content,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle google tag manger get error: ", err);
    res
      .status(500)
      .json({ description: "Something went wrong", type: "error" });
  }
};
