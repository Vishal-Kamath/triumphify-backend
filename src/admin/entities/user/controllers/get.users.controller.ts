import { Request, Response } from "express";
import { Logger } from "@/utils/logger";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import _ from "lodash";

const handleGetAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = (await db.select().from(users)).map((user) =>
      _.omit(user, ["password"])
    );
    return res.status(200).send({ data: allUsers, type: "success" });
  } catch (err) {
    Logger.error("handle Get All Users error", err);
    return res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleGetAllUsers;
