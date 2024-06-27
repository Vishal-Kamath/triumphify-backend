import { db } from "@/lib/db";
import { blog_section, blogs } from "@/lib/db/schema/blog";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetBySlugBlog = async (
  req: Request<{ slug: string }>,
  res: Response
) => {
  try {
    const { slug } = req.params;

    const blogDetails = (
      await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1)
    )[0];
    if (!blogDetails) {
      return res.status(404).send({
        description: "Blog not found",
        type: "error",
      });
    }

    const blogSections = await db
      .select()
      .from(blog_section)
      .where(eq(blog_section.blogId, blogDetails.id));

    res.status(200).send({
      data: {
        blog: blogDetails,
        sections: blogSections,
      },
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get all blogs error: ", err);
    res
      .status(500)
      .json({ description: "internal server error", type: "error" });
  }
};

export default handleGetBySlugBlog;
