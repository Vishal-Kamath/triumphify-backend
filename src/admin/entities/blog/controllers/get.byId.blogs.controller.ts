import { getRole } from "@/admin/utils/getRole";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { blog_section, blogs } from "@/lib/db/schema/blog";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetByIdBlog = async (
  req: Request<{ blogId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { blogId } = req.params;
    const role = getRole(req.body.token.role);
    const { id } = req.body.token;

    const blogDetails = (
      await db.select().from(blogs).where(eq(blogs.id, blogId)).limit(1)
    )[0];
    if (!blogDetails) {
      return res.status(404).send({
        description: "Blog not found",
        type: "error",
      });
    }

    if (blogDetails.created_by !== id && role === "employee") {
      return res.status(403).send({
        description: "Forbidden",
        type: "error",
      });
    }

    const blogSections = await db
      .select()
      .from(blog_section)
      .where(eq(blog_section.blogId, blogId));

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

export default handleGetByIdBlog;
