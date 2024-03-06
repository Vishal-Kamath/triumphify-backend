import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqFileShuffle } from "../validators.image";
import path from "path";
import fs from "fs";
import __root from "@/cdn/utils/root";
import sharp from "sharp";
import { env } from "@/config/env.config";

const handleShuffleImage = async (
  req: Request<{}, {}, ReqFileShuffle>,
  res: Response
) => {
  try {
    const { shuffleWith, name, size, type, lastModified, base64 } = req.body;

    // delete image
    const pathName = path.join(__root, "public", "images", shuffleWith);
    fs.existsSync(pathName) && fs.unlinkSync(pathName);

    const fileName = `${name}-${new Date().getTime()}.webp`;
    const filePath = path.join(__root, "public", "images", fileName);

    let sanitizedBase64 = base64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(sanitizedBase64, "base64");
    sharp(imageBuffer)
      .toFormat("webp")
      .toBuffer()
      .then((data) => {
        fs.writeFileSync(filePath, data);
        Logger.success(`image: ${fileName} shuffled with: ${pathName}`);
        res
          .status(201)
          .send({ imageLink: `${env.CDN_ENDPOINT}/images/${fileName}` });
      })
      .catch((error) => {
        Logger.error("handle image shuffle error", error);
        res
          .status(500)
          .send({ description: "something went wrong", type: "error" });
      });
  } catch (err) {
    Logger.error("handle shuffle image", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleShuffleImage;
