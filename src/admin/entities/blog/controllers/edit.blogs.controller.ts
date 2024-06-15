import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqBlog } from "../validators";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import slugify from "slugify";
import { db } from "@/lib/db";
import { blog_section, blogs } from "@/lib/db/schema/blog";
import { eq } from "drizzle-orm";

const handleEditBlog = async (
  req: Request<{}, {}, ReqBlog & TokenPayload>,
  res: Response
) => {
  try {
    const { title, blog, image } = req.body;

    const slug = slugify(title);
    console.log("1");
    await db.transaction(async (trx) => {
      console.log("2");
      await trx
        .delete(blog_section)
        .where(eq(blog_section.blogId, blog[0].blogId));
      console.log("3");
      await trx
        .update(blogs)
        .set({
          title,
          slug,
          image,
        })
        .where(eq(blogs.id, blog[0].blogId));
      console.log("4");
      for (const entity of blog) {
        console.log("5", entity.order);
        await trx.insert(blog_section).values({
          id: entity.id,
          blogId: entity.blogId,
          type: entity.type,
          order: entity.order,
          content: entity.content,
        });
      }
    });

    res.status(201).json({ description: "blog updated", type: "success" });
  } catch (err) {
    Logger.error("handle edit blog error: ", err);
    res
      .status(500)
      .json({ description: "internal server error", type: "error" });
  }
};

export default handleEditBlog;
