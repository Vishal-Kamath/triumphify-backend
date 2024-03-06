import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqFileArrayOrString } from "../validators.image";
import path from "path";
import __root from "@/cdn/utils/root";
import sharp from "sharp";
import fs from "fs";
import { env } from "@/config/env.config";

const handleConditionalMultipleImage = async (
  req: Request<{}, {}, ReqFileArrayOrString>,
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
      if (typeof file === "string") {
        imageLinks.push(file);
        continue;
      }
      const { name, size, type, lastModified, base64 } = file;

      const fileName = `${name}-${new Date().getTime()}.webp`;
      const filePath = path.join(__root, "public", "images", fileName);

      let sanitizedBase64 = base64.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(sanitizedBase64, "base64");
      const data = await sharp(imageBuffer).toFormat("webp").toBuffer();

      fs.writeFileSync(filePath, data);
      imageLinks.push(`${env.CDN_ENDPOINT}/images/${fileName}`);
    }

    res.status(201).send({ imageLinks });
  } catch (err) {
    Logger.error("handle conditional shuffle image", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleConditionalMultipleImage;
