import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { db } from "@/lib/db";
import { eq, ne } from "drizzle-orm";
import { ReqLinkToBanner } from "../validators";
import { blogs } from "@/lib/db/schema";

const handleLinkBlogToBanner = async (
  req: Request<{ blogId: string }, {}, ReqLinkToBanner>,
  res: Response
) => {
  try {
    const { linked_to_main_banner } = req.body;
    const { blogId } = req.params;

    const fingBlog = (
      await db.select().from(blogs).where(eq(blogs.id, blogId)).limit(1)
    ).pop();
    if (!fingBlog) {
      return res.status(404).send({
        description: "product not found",
        type: "error",
      });
    }

    await db.transaction(async (trx) => {
      await trx
        .update(blogs)
        .set({ linked_to_main_banner })
        .where(eq(blogs.id, blogId));
      await trx
        .update(blogs)
        .set({ linked_to_main_banner: false })
        .where(ne(blogs.id, blogId));
    });

    res.status(200).send({
      description: `blog "${fingBlog.title}" ${
        linked_to_main_banner ? "linked" : "unlinked"
      } successfully`,
      type: "success",
    });
  } catch (error) {
    Logger.error("handle link blog to banner", error);
    res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleLinkBlogToBanner;
