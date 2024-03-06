import { db } from "@/lib/db";
import { banner } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetBanners = async (
  req: Request<{ type: "main" | "sub" }>,
  res: Response
) => {
  try {
    const { type } = req.params;
    const bannersList = await db
      .select()
      .from(banner)
      .where(and(eq(banner.type, type), eq(banner.is_published, true)));

    return res.status(200).send({ data: bannersList, type: "success" });
  } catch (err) {
    Logger.error("handle GetBanners error", err);
    return res
      .status(500)
      .send({ description: "someting went wrong", type: "error" });
  }
};

export default handleGetBanners;
