import { env } from "@/config/env.config";
import { db } from "@/lib/db";
import { blog_section, blogs } from "@/lib/db/schema/blog";
import { getNamefromLink } from "@/utils/cdn.utils";
import { Logger } from "@/utils/logger";
import axios from "axios";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleDeleteBlog = async (
  req: Request<{ blogId: string }>,
  res: Response
) => {
  try {
    const { blogId } = req.params;

    const blogSectionsImages = (await db
      .select()
      .from(blog_section)
      .where(
        and(eq(blog_section.blogId, blogId), eq(blog_section.type, "image"))
      )) as { content: { src: string } }[];
    const imagesNames = blogSectionsImages.map((entity) =>
      getNamefromLink(entity.content.src)
    );

    axios
      .post(
        `${env.CDN_ENDPOINT}/api/images/delete/multiple`,
        {
          names: imagesNames,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then(async (_) => {
        await db.transaction(async (trx) => {
          await trx.delete(blog_section).where(eq(blog_section.blogId, blogId));
          await trx.delete(blogs).where(eq(blogs.id, blogId));
        });

        res.status(200).send({
          description: "blog deleted successfully",
          type: "success",
        });
      })
      .catch((err) => {
        Logger.error("handle delete blog error: ", err);
        res
          .status(500)
          .json({ description: "internal server error", type: "error" });
      });
  } catch (err) {
    Logger.error("handle delete blog error: ", err);
    res
      .status(500)
      .json({ description: "internal server error", type: "error" });
  }
};

export default handleDeleteBlog;
