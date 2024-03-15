import { db } from "@/lib/db";
import { banner } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetByIdBanner = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const Banner = (
      await db.select().from(banner).where(eq(banner.id, id)).limit(1)
    )[0];

    if (!Banner) {
      return res
        .status(404)
        .send({ description: "Banner not found", type: "error" });
    }

    return res.status(200).send({
      data: Banner,
      type: "success",
    });
  } catch (error) {
    Logger.error("Get By Id Banner", error);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetByIdBanner;
