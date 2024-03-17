import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { CategoryType } from "../validators.catrgories";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import axios from "axios";
import slugify from "slugify";
import { v4 as uuid } from "uuid";
import { env } from "@/config/env.config";

const handleCreateCategory = async (
  req: Request<{}, {}, CategoryType>,
  res: Response
) => {
  try {
    const {
      name,
      description,
      meta_title,
      meta_description,
      meta_keywords,
      category_image,
    } = req.body;

    const slug = slugify(name);

    const categoryExist = (
      await db
        .select()
        .from(categories)
        .where(or(eq(categories.name, name), eq(categories.slug, slug)))
        .limit(1)
    )[0];
    if (categoryExist) {
      return res
        .status(400)
        .send({ description: "Category already exist", type: "error" });
    }

    axios
      .post<{ imageLink: string }>(
        `${env.CDN_ENDPOINT}/api/images/upload`,
        {
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
        await db.insert(categories).values({
          id: uuid(),
          name,
          slug,
          description,
          category_image: imageLink,
          meta_title,
          meta_description,
          meta_keywords,
        });
        res.status(201).send({
          title: "Category created",
          description: `category ${name} created successfully`,
          type: "success",
        });
      })
      .catch((err) => {
        Logger.error("handle create category", err);
        res
          .status(500)
          .send({ description: "Internal server error", type: "error" });
      });
  } catch (error) {
    Logger.error("handle create category", error);
    res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleCreateCategory;
