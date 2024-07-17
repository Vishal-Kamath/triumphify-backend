import { env } from "@/config/env.config";
import * as crypto from "crypto";

export class Encrypt {
  static algorithm = "aes-256-cbc";
  static key = Buffer.from(env.ENCRYPT_KEY!, "hex");
  static iv = Buffer.from(env.ENCRYPT_IV!, "hex");

  static encrypt(text: string): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.key),
      this.iv
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${this.iv.toString("hex")}:${encrypted.toString("hex")}`;
  }

  static decrypt(text: string): string {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift()!, "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.key),
      iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
