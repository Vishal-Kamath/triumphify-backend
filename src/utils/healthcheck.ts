import { Request, Response } from "express";

export const healthCheck = (message: any) => (req: Request, res: Response) => {
  return res.status(200).send(message);
};
