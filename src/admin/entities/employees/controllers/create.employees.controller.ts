import { Request, Response } from "express";
import { Logger } from "@/utils/logger";
import { ReqEmployeeWithPassword } from "../validators.employees";
import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { env } from "@/config/env.config";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { CSVLogger } from "@/utils/csv.logger";
import { getRole } from "@/admin/utils/getRole";
import { newEmployeeGreetings } from "@/utils/courier/new-employee-greetings";

const handleCreateEmployee = async (
  req: Request<{}, {}, ReqEmployeeWithPassword & TokenPayload>,
  res: Response
) => {
  try {
    const { email, username, password, role, token } = req.body;

    const employeeExists = (
      await db.select().from(employee).where(eq(employee.email, email))
    )[0];
    if (employeeExists) {
      return res.status(400).send({
        description: `Employee with email ${email} already exists!!`,
        type: "error",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(employee).values({
      id: uuid(),
      email,
      username,
      password: hashedPassword,
      role: role === "admin" ? env.ADMIN : env.EMPLOYEE,
      status: "active",
    });

    newEmployeeGreetings({
      email,
      data: {
        userName: username,
        loginEmail: email,
        password,
      },
    });

    CSVLogger.succes(
      token.id,
      getRole(token.role),
      `created a new employee ${role}:${username}`
    );
    return res.status(201).send({
      title: "Employee Created!!",
      description: `Employee with username ${username} successfully created!!`,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle create employees error", err);
    res
      .status(500)
      .json({ description: "internal server error", type: "error" });
  }
};

export default handleCreateEmployee;
