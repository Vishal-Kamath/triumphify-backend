import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqShowcaseAUpdate } from "../validators.showcase";
import { db } from "@/lib/db";
import { product_showcase } from "@/lib/db/schema";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { env } from "@/config/env.config";
import { eq } from "drizzle-orm";
import { getNamefromLink } from "@/utils/cdn.utils";
import { Showcase } from "@/lib/@types/showcase";

const handleUpdateShowcaseA = async (
  req: Request<{}, {}, ReqShowcaseAUpdate>,
  res: Response
) => {
  try {
    const { templateId, template, product_id, content } = req.body;
    const { template_image } = content;

    const findShowcase = (
      await db
        .select()
        .from(product_showcase)
        .where(eq(product_showcase.id, templateId))
        .limit(1)
    )[0] as Showcase;
    if (!findShowcase) {
      return res.status(404).send({
        description: "showcase not found",
        type: "error",
      });
    }

    if (typeof template_image === "string") {
      await db
        .update(product_showcase)
        .set({
          content,
        })
        .where(eq(product_showcase.id, templateId));

      res.status(201).send({
        title: "Showcase updated",
        description: `showcase updated successfully`,
        type: "success",
      });
    } else {
      if (findShowcase.template !== "A") return;
      axios
        .post<{ imageLink: string }>(
          `${env.CDN_ENDPOINT}/api/images/shuffle`,
          {
            shuffleWith: getNamefromLink(findShowcase.content.template_image),
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
          await db
            .update(product_showcase)
            .set({
              content: {
                ...content,
                template_image: imageLink,
              },
            })
            .where(eq(product_showcase.id, templateId));

          res.status(201).send({
            title: "Showcase updated",
            description: `showcase updated successfully`,
            type: "success",
          });
        })
        .catch((err) => {
          Logger.error("handle create showcase a image upload", err);
          res
            .status(500)
            .send({ description: "Internal server error", type: "error" });
        });
    }
  } catch (err) {
    Logger.error("handle create showcase a", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleUpdateShowcaseA;
