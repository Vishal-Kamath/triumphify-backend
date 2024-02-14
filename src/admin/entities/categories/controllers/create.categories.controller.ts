import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { CategoryType } from "../validators.catrgories";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const handleCreateCategory = async (
  req: Request<{}, {}, CategoryType>,
  res: Response
) => {
  try {
    const { name, description, meta_title, meta_description, meta_keywords } =
      req.body;

    const categoryExist = (
      await db
        .select()
        .from(categories)
        .where(eq(categories.name, name))
        .limit(1)
    )[0];
    if (categoryExist) {
      return res
        .status(400)
        .send({ description: "Category already exist", type: "error" });
    }

    console.log(req.body.category_image.base64.length);

    // await db.insert(categories).values({
    //   id: uuid(),
    //   name,
    //   description,
    //   meta_title,
    //   meta_description,
    //   meta_keywords,
    // });

    res.status(201).send({
      title: "Category created",
      description: `category ${name} created successfully`,
      type: "success",
    });
  } catch (error) {
    Logger.error("handle create category", error);
    res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleCreateCategory;
