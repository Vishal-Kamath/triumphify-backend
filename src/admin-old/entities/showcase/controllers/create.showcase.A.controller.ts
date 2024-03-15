import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqShowcaseA } from "../validators.showcase";
import { db } from "@/lib/db";
import { product_showcase } from "@/lib/db/schema";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { env } from "@/config/env.config";
import { eq } from "drizzle-orm";

const handleCreateShowcaseA = async (
  req: Request<{}, {}, ReqShowcaseA>,
  res: Response
) => {
  try {
    const { template, product_id, content } = req.body;
    const { template_image } = content;

    axios
      .post<{ imageLink: string }>(
        `${env.CDN_ENDPOINT}/api/images/upload`,
        {
          name: template_image.name,
          type: template_image.type,
          size: template_image.size,
          lastModified: template_image.lastModified,
          base64: template_image.base64,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        const { imageLink } = response.data;
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
            title: content.title,
            description: content.description,
            template_image: imageLink,
          },
        });
        res.status(201).send({
          title: "Showcase created",
          description: `showcase created successfully`,
          type: "success",
        });
      })
      .catch((err) => {
        Logger.error("handle create showcase a image upload", err);
        res
          .status(500)
          .send({ description: "Internal server error", type: "error" });
      });
  } catch (err) {
    Logger.error("handle create showcase a", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleCreateShowcaseA;
