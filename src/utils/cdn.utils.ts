import { env } from "@/config/env.config";

export const getNamefromLink = (link: string | null) =>
  link?.replace(`${env.CDN_ENDPOINT}/images/`, "");
