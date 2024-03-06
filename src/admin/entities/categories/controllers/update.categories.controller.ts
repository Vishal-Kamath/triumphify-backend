import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqUpdateCategory } from "../validators.catrgories";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import slugify from "slugify";
import { eq } from "drizzle-orm";
import axios from "axios";
import { env } from "@/config/env.config";
import { getNamefromLink } from "@/utils/cdn.utils";

const handleUpdateCategory = async (
  req: Request<{ id: string }, {}, ReqUpdateCategory>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      meta_title,
      meta_description,
      meta_keywords,
      category_image,
    } = req.body;
    const slug = slugify(name);

    const findCategory = (
      await db.select().from(categories).where(eq(categories.id, id)).limit(1)
    )[0];
    if (!findCategory) {
      return res.status(404).send({
        description: "Category not found",
        type: "error",
      });
    }

    if (typeof category_image === "string") {
      await db.update(categories).set({
        name,
        slug,
        description,
        meta_title,
        meta_description,
        meta_keywords,
      });

      return res.status(200).send({
        title: "Updated",
        description: `Category ${name} updated successfully`,
        type: "success",
      });
    } else {
      axios
        .post<{ imageLink: string }>(
          `${env.CDN_ENDPOINT}/api/images/shuffle`,
          {
            shuffleWith: getNamefromLink(findCategory.category_image),
            name: slug,
            type: category_image.type,
            size: category_image.size,
            lastModified: category_image.lastModified,
            base64: category_image.base64,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(async (response) => {
          const { imageLink } = response.data;
          await db.update(categories).set({
            name,
            slug,
            description,
            category_image: imageLink,
            meta_title,
            meta_description,
            meta_keywords,
          });
          return res.status(200).send({
            title: "Updated",
            description: `Category ${name} updated successfully`,
            type: "success",
          });
        })
        .catch((err) => {
          Logger.error("handle update category", err);
          res
            .status(500)
            .send({ description: "Internal server error", type: "error" });
        });
    }
  } catch (err) {
    Logger.error("handle update category error:", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleUpdateCategory;
