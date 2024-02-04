// import enviroment variables using dotenv
import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

import { envsafe, port, str } from "envsafe";

export const env = envsafe({
  PORT: port({
    devDefault: 3500,
    desc: "The port the app is running on",
    example: 80,
  }),
  ADMIN_PORT: port({
    devDefault: 3500,
    desc: "The port the app is running on",
    example: 80,
  }),
  NODE_ENV: str({
    devDefault: "development",
    choices: ["development", "production"],
  }),

  // nodemailer
  NODEMAILER_EMAIL: str(),
  NODEMAILER_EMAIL_PASSWORD: str(),

  // Drizzle config
  DB_HOST: str(),
  DB_PORT: port(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_DATABASE: str(),

  // Roles
  ADMIN: str(),
  EMPLOYEE: str(),

  // JWT
  ACCESS_TOKEN_PRIVATE: str(),
  ACCESS_TOKEN_PUBLIC: str(),

  REFRESH_TOKEN_PRIVATE: str(),
  REFRESH_TOKEN_PUBLIC: str(),
});
