import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { UpdateBanner } from "../validators.banner";
import { db } from "@/lib/db";
import { banner } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import axios from "axios";
import { env } from "@/config/env.config";
import { getNamefromLink } from "@/utils/cdn.utils";

const handleUpdateBanner = async (
  req: Request<{ id: string }, {}, UpdateBanner>,
  res: Response
) => {
  try {
    const { id } = req.params;
    let { link, is_published, banner_image_desktop, banner_image_mobile } =
      req.body;

    const findBanner = (
      await db.select().from(banner).where(eq(banner.id, id)).limit(1)
    )[0];
    if (!findBanner) {
      return res.status(404).send({
        description: "Banner not found",
        type: "error",
      });
    }

    if (typeof banner_image_desktop !== "string") {
      const shuffleResponseDesktop = await axios.post<{ imageLink: string }>(
        `${env.CDN_ENDPOINT}/api/images/shuffle`,
        {
          shuffleWith: getNamefromLink(findBanner.banner_image_desktop),
          name: "banner_image_desktop",
          type: banner_image_desktop.type,
          size: banner_image_desktop.size,
          lastModified: banner_image_desktop.lastModified,
          base64: banner_image_desktop.base64,
        }
      );
      if (shuffleResponseDesktop.status !== 201) {
        return res.status(500).send({
          description: "Something went wrong",
          type: "error",
        });
      }
      banner_image_desktop = shuffleResponseDesktop.data.imageLink;
    }
    if (typeof banner_image_mobile !== "string") {
      const shuffleResponseMobile = await axios.post<{ imageLink: string }>(
        `${env.CDN_ENDPOINT}/api/images/shuffle`,
        {
          shuffleWith: getNamefromLink(findBanner.banner_image_mobile),
          name: "banner_image_mobile",
          type: banner_image_mobile.type,
          size: banner_image_mobile.size,
          lastModified: banner_image_mobile.lastModified,
          base64: banner_image_mobile.base64,
        }
      );
      if (shuffleResponseMobile.status !== 201) {
        return res.status(500).send({
          description: "Something went wrong",
          type: "error",
        });
      }
      banner_image_mobile = shuffleResponseMobile.data.imageLink;
    }

    await db
      .update(banner)
      .set({
        link,
        is_published,
        banner_image_desktop,
        banner_image_mobile,
      })
      .where(eq(banner.id, id));

    return res.status(200).send({
      title: "Updated",
      description: `Banner updated successfully`,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle update banner error:", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleUpdateBanner;
