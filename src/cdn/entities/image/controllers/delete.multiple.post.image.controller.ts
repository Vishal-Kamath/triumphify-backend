import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import __root from "@/cdn/utils/root";

const handleDeleteMultipleImagePost = async (
  req: Request<{}, {}, { names: string[] }>,
  res: Response
) => {
  try {
    const { names } = req.body;

    if (!Array.isArray(names)) {
      // delete image when only 1
      const pathName = path.join(__root, "public", "images", names);
      fs.existsSync(pathName) && fs.unlinkSync(pathName);
    } else {
      // delete image when array
      for (const name of names) {
        const pathName = path.join(__root, "public", "images", name);
        fs.existsSync(pathName) && fs.unlinkSync(pathName);
      }
    }

    return res.status(200).send({
      description: "Images deleted successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle delete multiple image error:", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleDeleteMultipleImagePost;
