import { Request, Response } from "express";
import { ReqGoogleTagManager } from "../validators.config";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { Logger } from "@/utils/logger";
import { db } from "@/lib/db";
import { websiteConfigs } from "@/lib/db/schema/config";
import { desc, eq } from "drizzle-orm";
import { CSVLogger } from "@/utils/csv.logger";
import { getRole } from "@/admin/utils/getRole";

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

export const handleAddGoogleTagManagerConfig = async (
  req: Request<{}, {}, ReqGoogleTagManager & TokenPayload>,
  res: Response
) => {
  try {
    const { gtmId } = req.body;
    const { id, role } = req.body.token;

    const tagDoesExist = (
      await db
        .select()
        .from(websiteConfigs)
        .where(eq(websiteConfigs.type, "google_tag_manager"))
        .limit(1)
    )[0];
    if (tagDoesExist) {
      await db
        .update(websiteConfigs)
        .set({ content: { gtmId } })
        .where(eq(websiteConfigs.type, "google_tag_manager"));
    } else {
      await db
        .insert(websiteConfigs)
        .values({ type: "google_tag_manager", content: { gtmId } });
    }

    CSVLogger.info(
      id,
      getRole(role),
      "google tag manager config added successfully by user id: ",
      id
    );

    res.json({
      description: "Google tag manager config added successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle google tag manger add error: ", err);
    res
      .status(500)
      .json({ description: "Something went wrong", type: "error" });
  }
};

export const handleUpdateGoogleTagManagerConfig = async (
  req: Request<{}, {}, ReqGoogleTagManager & TokenPayload>,
  res: Response
) => {
  try {
    const { gtmId } = req.body;
    const { id, role } = req.body.token;

    const tagDoesExist = (
      await db
        .select()
        .from(websiteConfigs)
        .where(eq(websiteConfigs.type, "google_tag_manager"))
        .limit(1)
    )[0];
    if (tagDoesExist) {
      await db
        .update(websiteConfigs)
        .set({ content: { gtmId } })
        .where(eq(websiteConfigs.type, "google_tag_manager"));
    } else {
      await db
        .insert(websiteConfigs)
        .values({ type: "google_tag_manager", content: { gtmId } });
    }

    CSVLogger.info(
      id,
      getRole(role),
      "google tag manager config updated successfully by user id: ",
      id
    );

    res.json({
      description: "Google tag manager config updated successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle google tag manger update error: ", err);
    res
      .status(500)
      .json({ description: "Something went wrong", type: "error" });
  }
};

export const handleDeleteGoogleTagManagerConfig = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id, role } = req.body.token;

    await db
      .delete(websiteConfigs)
      .where(eq(websiteConfigs.type, "google_tag_manager"));

    CSVLogger.info(
      id,
      getRole(role),
      "google tag manager config deleted successfully by user id: ",
      id
    );

    res.json({
      description: "Google tag manager config deleted successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle google tag manger delete error: ", err);
    res
      .status(500)
      .json({ description: "Something went wrong", type: "error" });
  }
};
