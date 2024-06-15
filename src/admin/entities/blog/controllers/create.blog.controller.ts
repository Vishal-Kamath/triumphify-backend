import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqBlog } from "../validators";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { blog_section, blogs } from "@/lib/db/schema/blog";
import { db } from "@/lib/db";
import axios from "axios";
import { env } from "@/config/env.config";
import slugify from "slugify";

const handleCreateBlogDraft = async (
  req: Request<{}, {}, ReqBlog & TokenPayload>,
  res: Response
) => {
  try {
    const { title, blog, image } = req.body;
    const { id } = req.body.token;

    const slug = slugify(title);
    await db.transaction(async (trx) => {
      await trx.insert(blogs).values({
        id: blog[0].blogId,
        title,
        slug,
        created_by: id,
        image,
      });

      for (const entity of blog) {
        await trx.insert(blog_section).values({
          blogId: entity.blogId,
          id: entity.id,
          type: entity.type,
          order: entity.order,
          content: entity.content,
        });
      }
    });

    res
      .status(201)
      .json({ description: "blog draft created", type: "success" });
  } catch (err) {
    Logger.error("handle create blog draft error:", err);
    res
      .status(500)
      .json({ description: "internal server error", type: "error" });
  }
};

export default handleCreateBlogDraft;
