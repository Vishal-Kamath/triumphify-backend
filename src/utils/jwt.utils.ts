import { env } from "../config/env.config";
import jwt from "jsonwebtoken";

export type TokenPayload = {
  id: string;
};

export const signToken = (
  key: "ACCESS_TOKEN_PRIVATE" | "REFRESH_TOKEN_PRIVATE",
  id: string
) => {
  const token_private_key = env[key];
  if (!token_private_key) throw Error(`${key} private secret not found`);

  const payload: TokenPayload = {
    id,
  };

  const expiresIn = key === "ACCESS_TOKEN_PRIVATE" ? "15m" : "30d";

  const token = jwt.sign(payload, token_private_key, {
    algorithm: "RS256",
    expiresIn,
  });

  return token;
};

export function verifyJwt(
  token: string,
  key: "ACCESS_TOKEN_PUBLIC" | "REFRESH_TOKEN_PUBLIC"
) {
  const token_public_key = env[key];
  if (!token_public_key) throw Error(`${key} public secret not found`);

  try {
    const decoded = jwt.verify(token, token_public_key) as TokenPayload;
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err: any) {
    return {
      valid: false,
      expired: err.message === "jwt expired",
      decoded: null,
    };
  }
}
