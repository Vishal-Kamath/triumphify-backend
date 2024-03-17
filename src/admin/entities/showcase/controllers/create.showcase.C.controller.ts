import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqShowcaseC } from "../validators.showcase";
import axios from "axios";
import { env } from "@/config/env.config";
import { db } from "@/lib/db";
import { product_showcase } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

const handleCreateShowcaseC = async (
  req: Request<{}, {}, ReqShowcaseC>,
  res: Response
) => {
  try {
    const { template, product_id, content } = req.body;
    const {
      title0,
      description0,
      template_image0,
      title1,
      description1,
      template_image1,
    } = content;

    axios
      .post<{ imageLinks: [string, string] }>(
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
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        const [link0, link1] = response.data.imageLinks;
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
            title0: title0,
            description0: description0,
            template_image0: link0,
            title1: title1,
            description1: description1,
            template_image1: link1,
          },
        });
        res.status(201).send({
          title: "Showcase created",
          description: `showcase created successfully`,
          type: "success",
        });
      })
      .catch((err) => {
        Logger.error("handle create showcase C image upload", err);
        res
          .status(500)
          .send({ description: "Internal server error", type: "error" });
      });
  } catch (err) {
    Logger.error("handle create showcase C", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleCreateShowcaseC;
