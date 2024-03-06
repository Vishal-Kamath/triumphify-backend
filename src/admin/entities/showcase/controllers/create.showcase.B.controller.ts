import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqShowcaseB } from "../validators.showcase";
import { db } from "@/lib/db";
import { product_showcase } from "@/lib/db/schema";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { env } from "@/config/env.config";
import { eq } from "drizzle-orm";

const handleCreateShowcaseB = async (
  req: Request<{}, {}, ReqShowcaseB>,
  res: Response
) => {
  try {
    const { template, product_id, content } = req.body;
    const { template_image0, template_image1, template_image2 } = content;

    axios
      .post<{ imageLinks: [string, string, string] }>(
        `${env.CDN_ENDPOINT}/api/images/multiple`,
        {
          files: [
            {
              name: template_image0.name,
              type: template_image0.type,
              size: template_image0.size,
              lastModified: template_image0.lastModified,
              base64: template_image0.base64,
            },
            {
              name: template_image1.name,
              type: template_image1.type,
              size: template_image1.size,
              lastModified: template_image1.lastModified,
              base64: template_image1.base64,
            },
            {
              name: template_image2.name,
              type: template_image2.type,
              size: template_image2.size,
              lastModified: template_image2.lastModified,
              base64: template_image2.base64,
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
        const [link0, link1, link2] = response.data.imageLinks;
        const index = (
          await db
            .select()
            .from(product_showcase)
            .where(eq(product_showcase.product_id, product_id))
        ).length;
        await db.insert(product_showcase).values({
          id: uuid(),
          template,
          product_id,
          index,
          content: {
            title0: content.title0,
            description0: content.description0,
            template_image0: link0,
            title1: content.title1,
            description1: content.description1,
            template_image1: link1,
            title2: content.title2,
            description2: content.description2,
            template_image2: link2,
          },
        });
        res.status(201).send({
          title: "Showcase created",
          description: `showcase created successfully`,
          type: "success",
        });
      })
      .catch((err) => {
        Logger.error("handle create showcase b image upload", err);
        res
          .status(500)
          .send({ description: "Internal server error", type: "error" });
      });
  } catch (err) {
    Logger.error("handle create showcase b", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleCreateShowcaseB;
