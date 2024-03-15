import { db } from "@/lib/db";
import { product_showcase } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { asc, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetShowcaseById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const showcases = await db
      .select()
      .from(product_showcase)
      .where(eq(product_showcase.product_id, id))
      .orderBy(asc(product_showcase.created_at));

    res.status(200).send({ data: showcases, type: "success" });
  } catch (err) {
    Logger.error("handle get showcase", err);
    res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetShowcaseById;
