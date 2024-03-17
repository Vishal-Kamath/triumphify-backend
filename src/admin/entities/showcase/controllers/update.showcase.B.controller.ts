import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqShowcaseBUpdate, ZFile } from "../validators.showcase";
import { db } from "@/lib/db";
import { product_showcase } from "@/lib/db/schema";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { env } from "@/config/env.config";
import { eq } from "drizzle-orm";
import { getNamefromLink } from "@/utils/cdn.utils";
import { Showcase } from "@/lib/@types/showcase";

const handleUpdateShowcaseB = async (
  req: Request<{}, {}, ReqShowcaseBUpdate>,
  res: Response
) => {
  try {
    const { templateId, template, product_id, content } = req.body;
    let { template_image0, template_image1, template_image2 } = content;

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

    if (
      typeof template_image0 === "string" &&
      typeof template_image1 === "string" &&
      typeof template_image2 === "string"
    ) {
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
      if (findShowcase.template !== "B") return;
      if (typeof template_image0 !== "string") {
        const response = await getShuffle(
          findShowcase.content.template_image0,
          template_image0
        );

        if (response.status !== 201) {
          return res.status(500).send({
            description: "Something went wrong",
            type: "error",
          });
        }
        template_image0 = response.data.imageLink;
      }
      if (typeof template_image1 !== "string") {
        const response = await getShuffle(
          findShowcase.content.template_image1,
          template_image1
        );

        if (response.status !== 201) {
          return res.status(500).send({
            description: "Something went wrong",
            type: "error",
          });
        }
        template_image1 = response.data.imageLink;
      }
      if (typeof template_image2 !== "string") {
        const response = await getShuffle(
          findShowcase.content.template_image2,
          template_image2
        );

        if (response.status !== 201) {
          return res.status(500).send({
            description: "Something went wrong",
            type: "error",
          });
        }
        template_image2 = response.data.imageLink;
      }

      await db
        .update(product_showcase)
        .set({
          content: {
            ...content,
            template_image0,
            template_image1,
            template_image2,
          },
        })
        .where(eq(product_showcase.id, templateId));

      res.status(201).send({
        title: "Showcase updated",
        description: `showcase updated successfully`,
        type: "success",
      });
    }
  } catch (err) {
    Logger.error("handle update showcase b", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleUpdateShowcaseB;

const getShuffle = async (shuffleWith: string, image: ZFile) => {
  return axios.post<{ imageLink: string }>(
    `${env.CDN_ENDPOINT}/api/images/shuffle`,
    {
      shuffleWith: getNamefromLink(shuffleWith),
      ...image,
    }
  );
};
