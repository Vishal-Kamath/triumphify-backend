import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqFile } from "../validators.image";
import path from "path";
import __root from "@/cdn/utils/root";
import fs from "fs";
import { env } from "@/config/env.config";
import sharp from "sharp";

const handleUploadImage = async (
  req: Request<{}, {}, ReqFile>,
  res: Response
) => {
  try {
    const { name, type, base64 } = req.body;
    const fileName = `${name}-${new Date().getTime()}.webp`;

    const filePath = path.join(__root, "public", "images", fileName);

    let sanitizedBase64 = base64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(sanitizedBase64, "base64");
    sharp(imageBuffer)
      .toFormat("webp")
      .toBuffer()
      .then((data) => {
        fs.writeFileSync(filePath, data);
        Logger.success(`image uploaded: ${fileName}`);
        res
          .status(201)
          .send({ imageLink: `${env.CDN_ENDPOINT}/images/${fileName}` });
      })
      .catch((error) => {
        Logger.error("handle image upload error", error);
        res
          .status(500)
          .send({ description: "something went wrong", type: "error" });
      });
  } catch (err) {
    Logger.error("handle image upload error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleUploadImage;
