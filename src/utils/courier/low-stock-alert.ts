import { employee } from "@/lib/db/schema";
import { sendCourier } from "./courier";
import { db } from "@/lib/db";
import { ne } from "drizzle-orm";
import { getRoleEnv } from "@/admin/utils/getRole";

export async function lowStockAlert({
  data,
}: {
  data: {
    redirect: string;
    productName: string;
    variation: string;
    quantity: string;
  };
}) {
  const fetchAllAdmins = await db
    .select({ email: employee.email, username: employee.username })
    .from(employee)
    .where(ne(employee.role, getRoleEnv("employee")));

  for (const admin of fetchAllAdmins) {
    await sendCourier({
      email: admin.email,
      data: {
        userName: admin.username,
        redirect: data.redirect,
        productName: data.productName,
        variation: data.variation,
        quantity: data.quantity,
      },
      template: "5DMQ0WQX9K4FEPJWNH75277PZN6B",
    });
  }
}
