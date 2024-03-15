import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { Banner } from "../validators.banner";
import { db } from "@/lib/db";
import { banner } from "@/lib/db/schema";
import axios from "axios";
import { env } from "@/config/env.config";
import { v4 as uuid } from "uuid";

const handleCreateBanner =
  (type: "main" | "sub") =>
  async (req: Request<{}, {}, Banner>, res: Response) => {
    try {
      const { link, is_published, banner_image_desktop, banner_image_mobile } =
        req.body;
      axios
        .post<{ imageLinks: [string, string] }>(
          `${env.CDN_ENDPOINT}/api/images/multiple`,
          {
            files: [
              {
                name: "banner_image_desktop",
                type: banner_image_desktop.type,
                size: banner_image_desktop.size,
                lastModified: banner_image_desktop.lastModified,
                base64: banner_image_desktop.base64,
              },
              {
                name: "banner_image_mobile",
                type: banner_image_mobile.type,
                size: banner_image_mobile.size,
                lastModified: banner_image_mobile.lastModified,
                base64: banner_image_mobile.base64,
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(async (response) => {
          const [banner_image_desktop, banner_image_mobile] =
            response.data.imageLinks;
          await db.insert(banner).values({
            id: uuid(),
            link,
            type,
            is_published,
            banner_image_desktop,
            banner_image_mobile,
          });
          res.status(201).send({
            title: "Banner created",
            description: `Banner created successfully`,
            type: "success",
          });
        })
        .catch((err) => {
          Logger.error(
            "handle create banner error while uploading image: ",
            err
          );
          res
            .status(500)
            .send({ description: "Internal server error", type: "error" });
        });
    } catch (err) {
      Logger.error("handle create banner error: ", err);
      res
        .status(500)
        .send({ description: "Internal server error", type: "error" });
    }
  };

export default handleCreateBanner;
