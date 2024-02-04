import { Request, Response } from "express";
import { Logger } from "@/utils/logger";
import { ReqEmployee } from "../validators.employees";
import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { env } from "@/config/env.config";

const handleCreateEmployee = async (
  req: Request<{}, {}, ReqEmployee>,
  res: Response
) => {
  try {
    const { username, password, role } = req.body;

    const employeeExists = (
      await db.select().from(employee).where(eq(employee.username, username))
    )[0];
    if (employeeExists) {
      return res.status(400).send({
        description: `Employee with username ${username} already exists!!`,
        type: "error",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword.length);
    await db.insert(employee).values({
      id: uuid(),
      username,
      password: hashedPassword,
      role: role === "admin" ? env.ADMIN : env.EMPLOYEE,
    });

    return res.status(201).send({
      title: "Employee Created!!",
      description: `Employee with username ${username} success fully created!!`,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle create employees error", err);
    res.status(500).json({ description: "internal server error", type: "error" });
  }
};

export default handleCreateEmployee;
