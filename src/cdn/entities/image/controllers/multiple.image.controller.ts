import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqFileArray } from "../validators.image";
import path from "path";
import __root from "@/cdn/utils/root";
import sharp from "sharp";
import fs from "fs";
import { env } from "@/config/env.config";

const handleMultipleImageUpload = async (
  req: Request<{}, {}, ReqFileArray>,
  res: Response
) => {
  try {
    const { files } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).send({
        description: "files not found",
        type: "error",
      });
    }

    let imageLinks: string[] = [];

    for (let file of files) {
      const { name, size, type, lastModified, base64 } = file;

      const fileName = `${name}-${new Date().getTime()}.webp`;
      const filePath = path.join(__root, "public", "images", fileName);

      let sanitizedBase64 = base64.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(sanitizedBase64, "base64");
      sharp(imageBuffer)
        .toFormat("webp")
        .toBuffer()
        .then((data) => {
          fs.writeFileSync(filePath, data);
          imageLinks.push(`${env.CDN_ENDPOINT}/images/${fileName}`);
          if (imageLinks.length === files.length) {
            res.status(201).send({ imageLinks });
          }
        })
        .catch((error) => {
          Logger.error("handle multiple image upload error", error);
          res
            .status(500)
            .send({ description: "something went wrong", type: "error" });
        });
    }
  } catch (err) {
    Logger.error("handle multiple image upload", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};
export default handleMultipleImageUpload;
