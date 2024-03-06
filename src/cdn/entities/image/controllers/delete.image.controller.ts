import fs from "fs";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqImageName } from "../validators.image";
import path from "path";
import __root from "@/cdn/utils/root";

const handleDeleteImage = async (req: Request<ReqImageName>, res: Response) => {
  try {
    const { name } = req.params;

    // delete image
    const pathName = path.join(__root, "public", "images", name);
    fs.existsSync(pathName) && fs.unlinkSync(pathName);

    res
      .status(200)
      .send({ description: "Image deleted successfully", type: "success" });
  } catch (err) {
    Logger.error("handle delete image error", err);
    res.status(500).end({});
  }
};

export default handleDeleteImage;
