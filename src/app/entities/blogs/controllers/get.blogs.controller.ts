import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema/blog";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";

const handleGetAllBlogs = async (
  req: Request<{}, {}, TokenPayload, { status: "draft" }>,
  res: Response
) => {
  try {
    const allBlogs = await db.select().from(blogs);

    res.status(200).send({
      data: allBlogs,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get all blogs error: ", err);
    res
      .status(500)
      .json({ description: "internal server error", type: "error" });
  }
};

export default handleGetAllBlogs;
