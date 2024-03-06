import { db } from "@/lib/db";
import { banner } from "@/lib/db/schema";
import { getNamefromLink } from "@/utils/cdn.utils";
import { Logger } from "@/utils/logger";
import axios from "axios";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleDeleteBanner = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const findBanner = (
      await db.select().from(banner).where(eq(banner.id, id)).limit(1)
    )[0];
    if (!findBanner) {
      return res.status(404).send({
        title: "Error",
        description: "Banner not found",
        type: "error",
      });
    }

    axios
      .delete(
        `${
          process.env.CDN_ENDPOINT
        }/api/images/delete/multiple?names=${getNamefromLink(
          findBanner.banner_image_desktop
        )}&names=${getNamefromLink(findBanner.banner_image_mobile)}`
      )
      .then(async () => {
        await db.delete(banner).where(eq(banner.id, id));

        return res.status(200).send({
          title: "Success",
          description: "Banner deleted successfully",
          type: "success",
        });
      })
      .catch((err) => {
        Logger.error("handle delete banner error:", err);
        return res
          .status(500)
          .send({ description: "something went wrong", type: "error" });
      });
  } catch (err) {
    Logger.error("handle delete banner error:", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleDeleteBanner;
