import { env } from "@/config/env.config";
import jwt from "jsonwebtoken";

export type TokenPayload = {
  token: {
    id: string;
  };
};

export const signToken = ({
  key,
  id,
}: {
  key: "ACCESS_TOKEN_PRIVATE" | "REFRESH_TOKEN_PRIVATE" | "RESET_TOKEN_PRIVATE";
  id: string;
}) => {
  const token_private_key = env[key];
  if (!token_private_key) throw Error(`${key} private secret not found`);

  const payload: TokenPayload = {
    token: {
      id,
    },
  };

  const expiresIn = key === "REFRESH_TOKEN_PRIVATE" ? "30d" : "15m";

  const token = jwt.sign(payload, token_private_key, {
    algorithm: "RS256",
    expiresIn,
  });

  return token;
};

export function verifyJwt({
  key,
  token,
}: {
  token: string;
  key: "ACCESS_TOKEN_PUBLIC" | "REFRESH_TOKEN_PUBLIC" | "RESET_TOKEN_PUBLIC";
}) {
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
