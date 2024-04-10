import { getRole } from "@/admin/utils/getRole";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import handleNavEmployee from "./employee.nav";
import handleNavSuperAdmin from "./superadmin";

const handleNav = async (req: Request<{}, {}, TokenPayload>, res: Response) => {
  try {
    const { id, role } = req.body.token;
    const roleValue = getRole(role);
    if (roleValue === "employee") return handleNavEmployee(req, res);
    if (roleValue === "superadmin") return handleNavSuperAdmin(req, res);
  } catch (err) {
    Logger.error("nav error", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleNav;
