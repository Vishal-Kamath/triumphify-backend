import { db } from "@/lib/db";
import { banner } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllBanner =
  (type: "main" | "sub") => async (req: Request, res: Response) => {
    try {
      const Banners = await db
        .select()
        .from(banner)
        .where(eq(banner.type, type));

      return res.status(200).send({
        data: Banners,
        type: "success",
      });
    } catch (error) {
      Logger.error("Get All Banner", error);
      res
        .status(500)
        .send({ description: "something went wrong", type: "error" });
    }
  };

export default handleGetAllBanner;
