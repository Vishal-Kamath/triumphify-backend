import { getRoleEnv } from "@/admin/utils/getRole";
import { env } from "@/config/env.config";
import { OrderDetails } from "@/lib/@types/orders";
import { db } from "@/lib/db";
import { DbOrders, employee } from "@/lib/db/schema";
import { ne } from "drizzle-orm";
import sendEmail from "./mailer";

export async function orderPlacedMailToAdmin({
  orders,
  order_details,
}: {
  orders: DbOrders[];
  order_details: OrderDetails;
}) {
  const fetchAllAdmins = await db
    .select({ email: employee.email, username: employee.username })
    .from(employee)
    .where(ne(employee.role, getRoleEnv("employee")));
  for (const admin of fetchAllAdmins) {
    const message = orderPlacedMailFormatToAdmin({
      userName: admin.username,
      orders,
      order_details,
    });
    // Send email
    console.log("sent to" + admin.email);
    await sendEmail({
      email: admin.email,
      message,
      subject: "New Order Placed!!",
    });
  }
}

function orderPlacedMailFormatToAdmin({
  userName,
  orders,
  order_details,
}: {
  userName: string;
  orders: DbOrders[];
  order_details: OrderDetails;
}) {
  const productsHtml = orders
    .map(
      (order) =>
        `
        <tr style="
        background: #ffffff;
        background-color: #ffffff;
        ">
          <td style="padding-top: 0;">
              <table width="520" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #eeeeee;">
                  <tbody>
                      <tr>
                          <td rowspan="${
                            Object.keys(
                              order.product_variation_combinations as Record<
                                string,
                                string
                              >
                            ).length + 5
                          }" style="padding-right: 10px; padding-bottom: 10px;">
                              <img style="height: 80px;" src="${
                                order.product_image
                              }" alt="${order.product_name}" />
                          </td>
                          <td colspan="2" style="font-size: 14px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                              ${order.product_name}
                          </td>
                      </tr>
                      <tr>
                          <td style="font-size: 14px; line-height: 18px; color: #757575; width: 440px;">
                            <a style="color: #2a9edb; font-weight: 500; text-decoration: none;" href="${
                              env.ADMIN_WEBSITE + "/orders/details/" + order.id
                            }">View Order</a>
                          </td>
                          <td style="width: 130px;"></td>
                      </tr>
                      <tr>
                          <td style="font-size: 14px; line-height: 18px; color: #757575; width: 440px;">
                              Quantity: ${order.product_quantity}
                          </td>
                          <td style="width: 130px;"></td>
                      </tr>
                      
                          ${Object.keys(
                            order.product_variation_combinations as Record<
                              string,
                              string
                            >
                          )
                            .map(
                              (varient) =>
                                `
                              <tr>
                                <td style="font-size: 14px; line-height: 18px; color: #757575;">
                                    ${varient}: ${
                                  (
                                    order.product_variation_combinations as Record<
                                      string,
                                      string
                                    >
                                  )[varient]
                                }
                                </td>
                                <td
                                  style="
                                    font-size: 14px;
                                    line-height: 18px;
                                    color: #757575;
                                    text-align: right;
                                  "
                                >
                                </td>
                              </tr>
                              `
                            )
                            .join("")}                   
                      <tr>
                          <td style="font-size: 14px; line-height: 18px; color: #757575; padding-bottom: 10px;">
                            
                          </td>
                          <td style="font-size: 14px; line-height: 18px; color: #757575; text-align: right; padding-bottom: 10px;">
                              <b style="color: #666666;">&#36;${
                                order.product_variation_final_price
                              }</b>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </td>
        </tr>
        `
    )
    .join("");

  return `
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title> </title>

        <style type="text/css">
          #outlook a {
            padding: 0;
          }
          body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          table,
          td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
          img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
          }
          p {
            display: block;
            margin: 13px 0;
          }
        </style>

        <style type="text/css">
          @media only screen and (min-width: 480px) {
            .mj-column-per-100 {
              width: 100% !important;
              max-width: 100%;
            }
          }
        </style>

        <style type="text/css">
          @media only screen and (max-width: 480px) {
            table.full-width-mobile {
              width: 100% !important;
            }
            td.full-width-mobile {
              width: auto !important;
            }
          }
        </style>
      </head>
      <body style="background-color: #f5f5f5">
        <div
          style="padding-bottom: 20px; background-color: #f5f5f5"
          class="c--email-body"
        >
          <div style="margin: 0px auto; max-width: 582px">
            <table
              style="width: 100%"
              role="presentation"
              cellspacing="0"
              cellpadding="0"
              border="0"
              align="center"
            >
              <tbody>
                <tr>
                  <td
                    style="
                      direction: ltr;
                      font-size: 0px;
                      padding: 20px 0 0 0;
                      text-align: center;
                    "
                  >
                    <div
                      style="
                        border-bottom: 1px solid #f5f5f5;
                        border-top: 6px solid #9d3789;
                        border-radius: 7px 7px 0 0;
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 582px;
                      "
                      class="c--email-header"
                    >
                      <table
                        style="
                          background: #ffffff;
                          background-color: #ffffff;
                          width: 100%;
                        "
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        align="center"
                      >
                        <tbody>
                          <tr>
                            <td
                              style="
                                border-left: 1px solid #f5f5f5;
                                border-right: 1px solid #f5f5f5;
                                direction: ltr;
                                font-size: 0px;
                                padding: 0px;
                                text-align: center;
                              "
                            >
                              <div
                                style="
                                  font-size: 0px;
                                  text-align: left;
                                  direction: ltr;
                                  display: inline-block;
                                  vertical-align: top;
                                  width: 100%;
                                "
                                class="mj-column-per-100 outlook-group-fix"
                              >
                                <table
                                  width="100%"
                                  role="presentation"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          background-color: #ffffff;
                                          vertical-align: top;
                                          padding: 0px;
                                          padding-top: 20px;
                                          padding-bottom: 20px;
                                          padding-left: 20px;
                                        "
                                      >
                                        <table
                                          width="100%"
                                          style=""
                                          role="presentation"
                                          cellspacing="0"
                                          cellpadding="0"
                                          border="0"
                                        ></table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div
                      style="
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 582px;
                      "
                    >
                      <table
                        style="
                          background: #ffffff;
                          background-color: #ffffff;
                          width: 100%;
                        "
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        align="center"
                      >
                        <tbody>
                          <tr>
                            <td
                              style="
                                border-left: 1px solid #f5f5f5;
                                border-right: 1px solid #f5f5f5;
                                direction: ltr;
                                font-size: 0px;
                                padding: 8px 30px;
                                text-align: center;
                              "
                            >
                              <div
                                style="
                                  font-size: 0px;
                                  text-align: left;
                                  direction: ltr;
                                  display: inline-block;
                                  vertical-align: top;
                                  width: 100%;
                                "
                                class="mj-column-per-100 outlook-group-fix"
                              >
                                <table
                                  width="100%"
                                  role="presentation"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          background-color: #ffffff;
                                          vertical-align: top;
                                          padding: 0px;
                                        "
                                      >
                                        <table
                                          width="100%"
                                          style=""
                                          role="presentation"
                                          cellspacing="0"
                                          cellpadding="0"
                                          border="0"
                                        ></table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div
                      style="
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 582px;
                      "
                      class="c--block c--block-image"
                    >
                      <table
                        style="
                          background: #ffffff;
                          background-color: #ffffff;
                          width: 100%;
                        "
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        align="center"
                      >
                        <tbody>
                          <tr>
                            <td
                              style="
                                border-left: 1px solid #f5f5f5;
                                border-right: 1px solid #f5f5f5;
                                direction: ltr;
                                font-size: 0px;
                                padding: 8px 30px;
                                text-align: center;
                              "
                            >
                              <div
                                style="
                                  font-size: 0px;
                                  text-align: left;
                                  direction: ltr;
                                  display: inline-block;
                                  vertical-align: top;
                                  width: 100%;
                                "
                                class="mj-column-per-100 outlook-group-fix"
                              >
                                <table
                                  width="100%"
                                  role="presentation"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          background-color: #ffffff;
                                          vertical-align: top;
                                          padding: 10px 0px;
                                        "
                                      >
                                        <table
                                          width="100%"
                                          style=""
                                          role="presentation"
                                          cellspacing="0"
                                          cellpadding="0"
                                          border="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style="
                                                  font-size: 0px;
                                                  padding: 0px;
                                                  word-break: break-word;
                                                "
                                                align="left"
                                              >
                                                <table
                                                  style="
                                                    border-collapse: collapse;
                                                    border-spacing: 0px;
                                                  "
                                                  role="presentation"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                  border="0"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td style="width: 200px">
                                                        <img
                                                          width="200"
                                                          style="
                                                            border: 0;
                                                            display: block;
                                                            outline: none;
                                                            text-decoration: none;
                                                            height: auto;
                                                            width: 100%;
                                                            font-size: 13px;
                                                          "
                                                          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYwIiBoZWlnaHQ9IjgyIiB2aWV3Qm94PSIwIDAgMzYwIDgyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNS4zMzMzMyAyNi4wNjI1VjEyLjMxMjVIMTguMDYyNVYyNi4wNjI1SDI1Ljg1NDJWMzUuNzcwOEgxOC4wNjI1VjQ3LjVDMTguMDYyNSA1MC45MDYzIDE5LjAyNiA1Mi42MDQyIDIwLjk1ODMgNTIuNjA0MkMyMS40MjcxIDUyLjYwNDIgMjEuOTI3MSA1Mi41MTU2IDIyLjQ1ODMgNTIuMzMzM0MyMi45ODQ0IDUyLjE0MDYgMjMuMzk1OCA1MS45NDc5IDIzLjY4NzUgNTEuNzVMMjQuMTI1IDUxLjQ1ODNMMjcuMjkxNyA2MS43NUMyNC41NTIxIDYzLjI5MTcgMjEuNDM3NSA2NC4wNjI1IDE3LjkzNzUgNjQuMDYyNUMxNS41MzEyIDY0LjA2MjUgMTMuNDYzNSA2My42NDU4IDExLjcyOTIgNjIuODEyNUMxMC4wMDUyIDYxLjk2ODggOC42OTc5MiA2MC44MzMzIDcuODEyNSA1OS40MTY3QzYuOTIxODcgNTggNi4yODEyNSA1Ni41MTU2IDUuODk1ODMgNTQuOTU4M0M1LjUyMDgzIDUzLjM5MDYgNS4zMzMzMyA1MS43MjQgNS4zMzMzMyA0OS45NTgzVjM1Ljc3MDhIMFYyNi4wNjI1SDUuMzMzMzNaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMjQuODI3MSA2Mi45ODA1VjI2LjA2MzhIMzcuNTc3MVYzMS4zNzYzSDM3LjcyM0MzNy44MTY3IDMxLjE4MzYgMzcuOTczIDMwLjk0OTIgMzguMTgxMyAzMC42NjhDMzguNDAwMSAzMC4zNzYzIDM4Ljg2ODggMjkuODcxMSAzOS41NzcxIDI5LjE0NzFDNDAuMjk1OSAyOC40Mjg0IDQxLjA2NjcgMjcuNzgyNiA0MS44ODk2IDI3LjIwOTZDNDIuNzA3NCAyNi42MjYzIDQzLjc2NDYgMjYuMTE1OSA0NS4wNTYzIDI1LjY2OEM0Ni4zNDggMjUuMjA5NiA0Ny42NjU3IDI0Ljk4MDUgNDkuMDE0NiAyNC45ODA1QzUwLjQwMDEgMjQuOTgwNSA1MS43Njk5IDI1LjE3ODQgNTMuMTE4OCAyNS41NjM4QzU0LjQ2MjYgMjUuOTM4OCA1NS40NTIxIDI2LjMyNDIgNTYuMDc3MSAyNi43MDk2TDU3LjA3NzEgMjcuMjcyMUw1MS43NDM4IDM4LjA4NDZDNTAuMTYwNSAzNi43NDA5IDQ3Ljk1NzQgMzYuMDYzOCA0NS4xMzk2IDM2LjA2MzhDNDMuNTk4IDM2LjA2MzggNDIuMjY5OSAzNi40MDc2IDQxLjE2MDUgMzcuMDg0NkM0MC4wNjE1IDM3Ljc1MTMgMzkuMjg1NSAzOC41NjM4IDM4LjgyNzEgMzkuNTIyMUMzOC4zNjg4IDQwLjQ4MDUgMzguMDQwNyA0MS4zMDM0IDM3Ljg0OCA0MS45ODA1QzM3LjY2NTcgNDIuNjQ3MSAzNy41NzcxIDQzLjE2OCAzNy41NzcxIDQzLjU0M1Y2Mi45ODA1SDI0LjgyNzFaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNNTUuMTI4NiA1LjQ4MDQ3QzU2LjYxMyAzLjk4MDQ3IDU4LjM4MzggMy4yMzA0NyA2MC40NDExIDMuMjMwNDdDNjIuNTA4OCAzLjIzMDQ3IDY0LjI4NDggMy45ODA0NyA2NS43NzQ0IDUuNDgwNDdDNjcuMjU4OCA2Ljk3MDA1IDY4LjAwMzYgOC43NDYwOSA2OC4wMDM2IDEwLjgxMzhDNjguMDAzNiAxMi44NzExIDY3LjI1ODggMTQuNjQxOSA2NS43NzQ0IDE2LjEyNjNDNjQuMjg0OCAxNy42MTU5IDYyLjUwODggMTguMzU1NSA2MC40NDExIDE4LjM1NTVDNTguMzgzOCAxOC4zNTU1IDU2LjYxMyAxNy42MTU5IDU1LjEyODYgMTYuMTI2M0M1My42MzkgMTQuNjQxOSA1Mi44OTk0IDEyLjg3MTEgNTIuODk5NCAxMC44MTM4QzUyLjg5OTQgOC43NDYwOSA1My42MzkgNi45NzAwNSA1NS4xMjg2IDUuNDgwNDdaTTUzLjg5OTQgMjYuMDYzOFY2Mi45ODA1SDY2LjY0OTRWMjYuMDYzOEg1My44OTk0WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTgwLjg4ODMgMjYuMDYyNVY0My42MjVDODAuODg4MyA0Ny4yNjU2IDgxLjQzNTIgNDkuODU0MiA4Mi41MzQyIDUxLjM5NThDODMuNjQzNiA1Mi45MjcxIDg1LjUxODYgNTMuNjg3NSA4OC4xNTkyIDUzLjY4NzVDOTAuNzk0NiA1My42ODc1IDkyLjY2NDQgNTIuOTI3MSA5My43NjMzIDUxLjM5NThDOTQuODcyNyA0OS44NTQyIDk1LjQzIDQ3LjI2NTYgOTUuNDMgNDMuNjI1VjI2LjA2MjVIMTA4LjE4VjQ2LjcwODNDMTA4LjE4IDUyLjg0OSAxMDYuNTgxIDU3LjI4MTMgMTAzLjM4OCA2MEMxMDAuMTkgNjIuNzA4MyA5NS4xMTc1IDY0LjA2MjUgODguMTU5MiA2NC4wNjI1QzgxLjIwMDggNjQuMDYyNSA3Ni4xMjI3IDYyLjcwODMgNzIuOTMgNjBDNjkuNzQ3NyA1Ny4yODEzIDY4LjE1OTIgNTIuODQ5IDY4LjE1OTIgNDYuNzA4M1YyNi4wNjI1SDgwLjg4ODNaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMTA5LjMxMSA2Mi45ODA1VjI2LjA2MzhIMTIyLjA2MVYyOS45Mzg4SDEyMi4yMDZDMTI1LjUwOCAyNi42MzY3IDEyOS4wNCAyNC45ODA1IDEzMi43OSAyNC45ODA1QzEzNS40NjcgMjQuOTgwNSAxMzcuOTgyIDI1LjUzNzggMTQwLjMzMSAyNi42NDcxQzE0Mi42OTEgMjcuNzQ2MSAxNDQuNDY3IDI5LjQ0OTIgMTQ1LjY2NSAzMS43NTEzQzE0OS40MTUgMjcuMjQwOSAxNTMuNDg4IDI0Ljk4MDUgMTU3Ljg5NCAyNC45ODA1QzE2MS44MzcgMjQuOTgwNSAxNjUuMjE3IDI2LjA4NDYgMTY4LjA0IDI4LjI5M0MxNzAuODczIDMwLjUwMTMgMTcyLjI5IDMzLjk1NDQgMTcyLjI5IDM4LjY0NzFWNjIuOTgwNUgxNTkuNTYxVjQyLjEwNTVDMTU5LjU2MSA0MC4xMzY3IDE1OS4wMTkgMzguNDkwOSAxNTcuOTM2IDM3LjE2OEMxNTYuODUyIDM1Ljg1MDMgMTU1LjIzMiAzNS4xODg4IDE1My4wODEgMzUuMTg4OEMxNTEuMjA2IDM1LjE4ODggMTQ5Ljc3NCAzNS43NjE3IDE0OC43OSAzNi44OTcxQzE0Ny44MTYgMzguMDIyMSAxNDcuMjc5IDM5LjM3NjMgMTQ3LjE4NiA0MC45NTk2VjYyLjk4MDVIMTM0LjQzNlY0Mi4xMDU1QzEzNC40MzYgNDAuMTM2NyAxMzMuODk0IDM4LjQ5MDkgMTMyLjgxMSAzNy4xNjhDMTMxLjczOCAzNS44NTAzIDEzMC4xMjMgMzUuMTg4OCAxMjcuOTU2IDM1LjE4ODhDMTI1Ljk4MiAzNS4xODg4IDEyNC41MDMgMzUuODA4NiAxMjMuNTE5IDM3LjA0M0MxMjIuNTQ1IDM4LjI2NjkgMTIyLjA2MSAzOS43MDk2IDEyMi4wNjEgNDEuMzc2M1Y2Mi45ODA1SDEwOS4zMTFaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMjExLjQzMSAzMC42MjYzQzIxNC44ODkgMzQuMzkxOSAyMTYuNjE4IDM5LjAxMTcgMjE2LjYxOCA0NC40ODA1QzIxNi42MTggNDkuOTU0NCAyMTQuODg5IDU0LjU4NDYgMjExLjQzMSA1OC4zNzYzQzIwNy45ODMgNjIuMTY4IDIwMy41OTcgNjQuMDYzOCAxOTguMjY0IDY0LjA2MzhDMTkzLjM3MyA2NC4wNjM4IDE4OS4zNDcgNjIuNTMyNiAxODYuMTgxIDU5LjQ1OTZWODEuNjg4OEgxNzMuNDMxVjI2LjA2MzhIMTg2LjAzNVYzMC4yMzA1SDE4Ni4xODFDMTg5LjM0NyAyNi43MzA1IDE5My4zNzMgMjQuOTgwNSAxOTguMjY0IDI0Ljk4MDVDMjAzLjU5NyAyNC45ODA1IDIwNy45ODMgMjYuODY1OSAyMTEuNDMxIDMwLjYyNjNaTTIwMC41OTcgNTAuNzUxM0MyMDIuMjY0IDQ5LjExNTkgMjAzLjA5NyA0Ny4wMjIxIDIwMy4wOTcgNDQuNDgwNUMyMDMuMDk3IDQxLjkzODggMjAyLjMwNiAzOS44NjU5IDIwMC43MjIgMzguMjUxM0MxOTkuMTM5IDM2LjY0MTkgMTk3LjA0NSAzNS44MzQ2IDE5NC40NTEgMzUuODM0NkMxOTEuOTYyIDM1LjgzNDYgMTg5LjkxNSAzNi42NTc2IDE4OC4zMDYgMzguMjkzQzE4Ni42OTEgMzkuOTE4IDE4NS44ODkgNDEuOTgwNSAxODUuODg5IDQ0LjQ4MDVDMTg1Ljg4OSA0Ny4wMjIxIDE4Ni43MTIgNDkuMTE1OSAxODguMzY4IDUwLjc1MTNDMTkwLjAxOSA1Mi4zNzYzIDE5Mi4wNDUgNTMuMTg4OCAxOTQuNDUxIDUzLjE4ODhDMTk2Ljg5NCA1My4xODg4IDE5OC45NDEgNTIuMzc2MyAyMDAuNTk3IDUwLjc1MTNaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMjE1LjgxNiA2Mi45Nzk4VjEuMDgzOThIMjI4LjU2NlYyOS45MzgySDIyOC43MTJDMjMyLjAxNCAyNi42MzYxIDIzNS41NDYgMjQuOTc5OCAyMzkuMjk2IDI0Ljk3OThDMjQxLjExMyAyNC45Nzk4IDI0Mi45MjEgMjUuMjI0NiAyNDQuNzEyIDI1LjcwOUMyNDYuNTE0IDI2LjE4MjkgMjQ4LjI0MyAyNi45Mjc3IDI0OS45IDI3LjkzODJDMjUxLjU1MSAyOC45MzgyIDI1Mi44ODkgMzAuMzY1MiAyNTMuOTIxIDMyLjIwOUMyNTQuOTYyIDM0LjA1NzkgMjU1LjQ4MyAzNi4yMDM4IDI1NS40ODMgMzguNjQ2NVY2Mi45Nzk4SDI0Mi43MzNWNDIuMTA0OEMyNDIuNzMzIDQwLjE4ODIgMjQyLjExOCAzOC41MTYzIDI0MC45IDM3LjA4NEMyMzkuNjc2IDM1LjY0MTMgMjM4LjA4NyAzNC45MTczIDIzNi4xMjkgMzQuOTE3M0MyMzQuMTk3IDM0LjkxNzMgMjMyLjQ1MiAzNS42NjIxIDIzMC45IDM3LjE0NjVDMjI5LjM0MiAzOC42MzYxIDIyOC41NjYgNDAuMjg3MSAyMjguNTY2IDQyLjEwNDhWNjIuOTc5OEgyMTUuODE2WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTI1Ny44NDkgNS40ODA0N0MyNTkuMzM0IDMuOTgwNDcgMjYxLjEwNCAzLjIzMDQ3IDI2My4xNjIgMy4yMzA0N0MyNjUuMjI5IDMuMjMwNDcgMjY3LjAwNiAzLjk4MDQ3IDI2OC40OTUgNS40ODA0N0MyNjkuOTc5IDYuOTcwMDUgMjcwLjcyNCA4Ljc0NjA5IDI3MC43MjQgMTAuODEzOEMyNzAuNzI0IDEyLjg3MTEgMjY5Ljk3OSAxNC42NDE5IDI2OC40OTUgMTYuMTI2M0MyNjcuMDA2IDE3LjYxNTkgMjY1LjIyOSAxOC4zNTU1IDI2My4xNjIgMTguMzU1NUMyNjEuMTA0IDE4LjM1NTUgMjU5LjMzNCAxNy42MTU5IDI1Ny44NDkgMTYuMTI2M0MyNTYuMzYgMTQuNjQxOSAyNTUuNjIgMTIuODcxMSAyNTUuNjIgMTAuODEzOEMyNTUuNjIgOC43NDYwOSAyNTYuMzYgNi45NzAwNSAyNTcuODQ5IDUuNDgwNDdaTTI1Ni42MiAyNi4wNjM4VjYyLjk4MDVIMjY5LjM3VjI2LjA2MzhIMjU2LjYyWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTI3My43NTQgMjYuMDYyNVYxOC4yMDgzQzI3My43OTYgMTIuNjk3OSAyNzUuMDg4IDguMjg2NDYgMjc3LjYyOSA0Ljk3OTE3QzI4MC4xODEgMS42NjE0NiAyODMuNzEzIDAgMjg4LjIxMyAwQzI5MC4xNCAwIDI5MS45ODMgMC4yODEyNDkgMjkzLjczMyAwLjgzMzMzM0MyOTUuNDgzIDEuMzc1IDI5Ni43MzkgMS45Mzc1IDI5Ny41MDQgMi41MjA4M0wyOTguNzMzIDMuMzEyNUwyOTQuMjc1IDEyLjMxMjVDMjkzLjExOSAxMS42MzU0IDI5MS44NDggMTEuMjkxNyAyOTAuNDYzIDExLjI5MTdDMjg4Ljg2NCAxMS4yOTE3IDI4Ny44MDEgMTEuODMzMyAyODcuMjc1IDEyLjkxNjdDMjg2Ljc0NCAxNCAyODYuNDgzIDE1Ljg4NTQgMjg2LjQ4MyAxOC41NjI1VjI2LjA2MjVIMjk0Ljk4M1YzNS43NzA4SDI4Ni40ODNWNjIuOTc5MkgyNzMuNzU0VjM1Ljc3MDhIMjY4LjQyMVYyNi4wNjI1SDI3My43NTRaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMzE5LjgwOCAyNi4wNjI1SDMzNC40OTVMMzA1LjQ5NSA4MS42ODc1SDI5MC44MDhMMzAzLjUzNyA1Ny4yMjkyTDI4Ni4wNTggMjYuMDYyNUgzMDAuNzQ1TDMxMS4wMzcgNDQuOTc5MkwzMTkuODA4IDI2LjA2MjVaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMzUxLjY4NSA0Ny41ODRDMzUzLjk4NyA0Ny41ODQgMzU1Ljk0IDQ4LjM5MTMgMzU3LjUzOSA1MC4wMDA3QzM1OS4xNDggNTEuNTk5NiAzNTkuOTU2IDUzLjU1MjcgMzU5Ljk1NiA1NS44NTQ4QzM1OS45NTYgNTguMTA0OCAzNTkuMTQ4IDYwLjAzNzEgMzU3LjUzOSA2MS42NDY1QzM1NS45NCA2My4yNTU5IDM1My45ODcgNjQuMDYzMiAzNTEuNjg1IDY0LjA2MzJDMzQ5LjQzNSA2NC4wNjMyIDM0Ny41MDMgNjMuMjU1OSAzNDUuODkzIDYxLjY0NjVDMzQ0LjI3OSA2MC4wMzcxIDM0My40NzcgNTguMTA0OCAzNDMuNDc3IDU1Ljg1NDhDMzQzLjQ3NyA1My41NTI3IDM0NC4yNzkgNTEuNTk5NiAzNDUuODkzIDUwLjAwMDdDMzQ3LjUwMyA0OC4zOTEzIDM0OS40MzUgNDcuNTg0IDM1MS42ODUgNDcuNTg0WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg=="
                                                          height="auto"
                                                          alt=""
                                                        />
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div
                      style="
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 582px;
                      "
                      class="c--block c--block-text"
                    >
                      <table
                        style="
                          background: #ffffff;
                          background-color: #ffffff;
                          width: 100%;
                        "
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        align="center"
                      >
                        <tbody>
                          <tr>
                            <td
                              style="
                                border-left: 1px solid #f5f5f5;
                                border-right: 1px solid #f5f5f5;
                                direction: ltr;
                                font-size: 0px;
                                padding: 8px 30px;
                                text-align: center;
                              "
                            >
                              <div
                                style="
                                  font-size: 0px;
                                  text-align: left;
                                  direction: ltr;
                                  display: inline-block;
                                  vertical-align: top;
                                  width: 100%;
                                "
                                class="mj-column-per-100 outlook-group-fix"
                              >
                                <table
                                  width="100%"
                                  role="presentation"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          background-color: transparent;
                                          vertical-align: top;
                                          padding: 4px 0px;
                                        "
                                      >
                                        <table
                                          width="100%"
                                          style=""
                                          role="presentation"
                                          cellspacing="0"
                                          cellpadding="0"
                                          border="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style="
                                                  font-size: 0px;
                                                  padding: 0px;
                                                  word-break: break-word;
                                                "
                                                class="c--text-h1"
                                                align="left"
                                              >
                                                <div
                                                  style="
                                                    font-family: Helvetica, Arial,
                                                      sans-serif;
                                                    font-size: 24px;
                                                    font-weight: 600;
                                                    line-height: 28px;
                                                    text-align: left;
                                                    color: #4c4c4c;
                                                  "
                                                >
                                                  Dear ${userName},
                                                </div>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:582px;" class="c--block c--block-markdown">
                      <table style="background:#ffffff;background-color:#ffffff;width:100%;" role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                        <tbody>
                          <tr>
                            <td style="border-left:1px solid #f5f5f5;border-right:1px solid #f5f5f5;direction:ltr;font-size:0px;padding:8px 30px;text-align:center;">    
                              <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;" class="mj-column-per-100 outlook-group-fix">
                                <table width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0">
                                  <tbody>
                                    <tr>
                                      <td style="background-color:#ffffff;vertical-align:top;padding:4px 0px;">
                                        <table width="100%" style="" role="presentation" cellspacing="0" cellpadding="0" border="0">
                                          <tbody>
                                            <tr>
                                              <td style="font-size:0px;padding:0px;word-break:break-word;" class="c--text-text" align="left">
                                                <div style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:18px;text-align:left;color:#4C4C4C;">
                                                  <p style="margin: 0;">
                                                  We are pleased to inform you that a new order has been placed. Below are the details for your immediate attention and action.
                                                  </p>
                                                </div>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    

                    <div
                      style="
                        padding: 8px 30px;
                        background: #ffffff;
                        background-color: #ffffff;
                      "
                    ><!-- Start address Section -->
                    <tr style="
                    background: #ffffff;
                    background-color: #ffffff;
                    ">
                        <td style="padding-top: 0;">
                            <table width="520" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #bbbbbb;">
                                <tbody>
                                    <tr>
                                        <td style="width: 55%; font-size: 16px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                                            Delivery Adderss
                                        </td>
                                        <td style="width: 45%; font-size: 16px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                                            Billing Address
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                            ${order_details.shipping_address_name}
                                        </td>
                                        <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                            ${order_details.billing_address_name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                            ${order_details.shipping_address_email}
                                        </td>
                                        <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                            ${order_details.billing_address_email}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                            ${order_details.shipping_address_tel}
                                        </td>
                                        <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                            ${order_details.billing_address_tel}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                            ${order_details.shipping_address_street_address}
                                        </td>
                                        <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                            ${order_details.shipping_address_street_address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                            ${order_details.shipping_address_city}, ${order_details.shipping_address_state}, ${order_details.shipping_address_country}
                                        </td>
                                        <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                            ${order_details.billing_address_city}, ${order_details.billing_address_state}, ${order_details.billing_address_country}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 15px;">
                                            ${order_details.shipping_address_zip}
                                        </td>
                                        <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 15px;">
                                            ${order_details.billing_address_zip}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <!-- End address Section -->
                    </div>

                    <div
                      style="
                        padding: 8px 30px;
                        background: #ffffff;
                        background-color: #ffffff;
                      "
                    >
                      ${productsHtml}
                    </div>

                    <div
                      style="
                        padding: 8px 30px;
                        background: #ffffff;
                        background-color: #ffffff;
                      "
                    >
                    <!-- Start calculation Section -->
                                      <tr style="
                                      background: #ffffff;
                                      background-color: #ffffff;
                                      ">
                                          <td style="padding-top: 0;">
                                              <table width="520" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #bbbbbb; margin-top: -5px;">
                                                  <tbody>
                                                      <tr>
                                                          <td rowspan="5" style="width: 55%;"></td>
                                                          <td style="font-size: 14px; line-height: 18px; color: #666666;">
                                                              Sub-Total:
                                                          </td>
                                                          <td style="font-size: 14px; line-height: 18px; color: #666666; width: 130px; text-align: right;">
                                                          &#36;${order_details.sub_total}
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px; border-bottom: 1px solid #eeeeee;">
                                                              Discount:
                                                          </td>
                                                          <td style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px; border-bottom: 1px solid #eeeeee; text-align: right;">
                                                          &#36;${order_details.discount}
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px;  padding-bottom: 15px;">
                                                              Order Total
                                                          </td>
                                                          <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px; text-align: right;  padding-bottom: 15px;">
                                                          &#36;${order_details.total}
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                      <!-- End calculation Section -->
                    </div

                    <div
                      style="
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 582px;
                      "
                      class="c--block c--block-text"
                    >
                      <table
                        style="
                          background: #ffffff;
                          background-color: #ffffff;
                          width: 100%;
                        "
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        align="center"
                      >
                        <tbody>
                          <tr>
                            <td
                              style="
                                border-left: 1px solid #f5f5f5;
                                border-right: 1px solid #f5f5f5;
                                direction: ltr;
                                font-size: 0px;
                                padding: 8px 30px;
                                text-align: center;
                              "
                            >
                              <div
                                style="
                                  font-size: 0px;
                                  text-align: left;
                                  direction: ltr;
                                  display: inline-block;
                                  vertical-align: top;
                                  width: 100%;
                                "
                                class="mj-column-per-100 outlook-group-fix"
                              >
                                <table
                                  width="100%"
                                  role="presentation"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          background-color: transparent;
                                          vertical-align: top;
                                          padding: 4px 0px;
                                        "
                                      >
                                        <table
                                          width="100%"
                                          style=""
                                          role="presentation"
                                          cellspacing="0"
                                          cellpadding="0"
                                          border="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style="
                                                  font-size: 0px;
                                                  padding: 0px;
                                                  word-break: break-word;
                                                "
                                                class="c--text-text"
                                                align="left"
                                              >
                                                <div
                                                  style="
                                                    font-family: Helvetica, Arial,
                                                      sans-serif;
                                                    font-size: 14px;
                                                    line-height: 18px;
                                                    text-align: left;
                                                    color: #4c4c4c;
                                                  "
                                                >
                                                We will send you another email once your order has been shipped, along with tracking information so you can monitor the delivery status. Please note that the estimated delivery date is subject to change based on factors such as item availability and shipping carrier delays.
                                                </div>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div
                      style="
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 582px;
                      "
                      class="c--block c--block-text"
                    >
                      <table
                        style="
                          background: #ffffff;
                          background-color: #ffffff;
                          width: 100%;
                        "
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        align="center"
                      >
                        <tbody>
                          <tr>
                            <td
                              style="
                                border-left: 1px solid #f5f5f5;
                                border-right: 1px solid #f5f5f5;
                                direction: ltr;
                                font-size: 0px;
                                padding: 8px 30px;
                                text-align: center;
                              "
                            >
                              <div
                                style="
                                  font-size: 0px;
                                  text-align: left;
                                  direction: ltr;
                                  display: inline-block;
                                  vertical-align: top;
                                  width: 100%;
                                "
                                class="mj-column-per-100 outlook-group-fix"
                              >
                                <table
                                  width="100%"
                                  role="presentation"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          background-color: transparent;
                                          vertical-align: top;
                                          padding: 4px 0px;
                                        "
                                      >
                                        <table
                                          width="100%"
                                          style=""
                                          role="presentation"
                                          cellspacing="0"
                                          cellpadding="0"
                                          border="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style="
                                                  font-size: 0px;
                                                  padding: 0px;
                                                  word-break: break-word;
                                                "
                                                class="c--text-text"
                                                align="left"
                                              >
                                                <div
                                                  style="
                                                    font-family: Helvetica, Arial,
                                                      sans-serif;
                                                    font-size: 14px;
                                                    line-height: 18px;
                                                    text-align: left;
                                                    color: #4c4c4c;
                                                  "
                                                >
If you have any questions or concerns regarding your order, feel free to reach out to our customer support team at helpdesk@triumphify.com. We are here to assist you every step of the way.                                                </div>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div
                      style="
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 582px;
                      "
                      class="c--block c--block-text"
                    >
                      <table
                        style="
                          background: #ffffff;
                          background-color: #ffffff;
                          width: 100%;
                        "
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        align="center"
                      >
                        <tbody>
                          <tr>
                            <td
                              style="
                                border-left: 1px solid #f5f5f5;
                                border-right: 1px solid #f5f5f5;
                                direction: ltr;
                                font-size: 0px;
                                padding: 8px 30px;
                                text-align: center;
                              "
                            >
                              <div
                                style="
                                  font-size: 0px;
                                  text-align: left;
                                  direction: ltr;
                                  display: inline-block;
                                  vertical-align: top;
                                  width: 100%;
                                "
                                class="mj-column-per-100 outlook-group-fix"
                              >
                                <table
                                  width="100%"
                                  role="presentation"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          background-color: transparent;
                                          vertical-align: top;
                                          padding: 4px 0px;
                                        "
                                      >
                                        <table
                                          width="100%"
                                          style=""
                                          role="presentation"
                                          cellspacing="0"
                                          cellpadding="0"
                                          border="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style="
                                                  font-size: 0px;
                                                  padding: 0px;
                                                  word-break: break-word;
                                                "
                                                class="c--text-text"
                                                align="left"
                                              >
                                                <div
                                                  style="
                                                    font-family: Helvetica, Arial,
                                                      sans-serif;
                                                    font-size: 14px;
                                                    line-height: 18px;
                                                    text-align: left;
                                                    color: #4c4c4c;
                                                  "
                                                >
                                                  Best regards,<br />Triumphify team
                                                </div>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div
                      style="
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 582px;
                      "
                    >
                      <table
                        style="
                          background: #ffffff;
                          background-color: #ffffff;
                          width: 100%;
                        "
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        align="center"
                      >
                        <tbody>
                          <tr>
                            <td
                              style="
                                border-left: 1px solid #f5f5f5;
                                border-right: 1px solid #f5f5f5;
                                direction: ltr;
                                font-size: 0px;
                                padding: 0px;
                                text-align: center;
                              "
                            >
                              <div
                                style="
                                  font-size: 0px;
                                  text-align: left;
                                  direction: ltr;
                                  display: inline-block;
                                  vertical-align: top;
                                  width: 100%;
                                "
                                class="mj-column-per-100 outlook-group-fix"
                              >
                                <table
                                  width="100%"
                                  role="presentation"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          background-color: #ffffff;
                                          vertical-align: top;
                                          padding: 0px;
                                        "
                                      >
                                        <table
                                          width="100%"
                                          style=""
                                          role="presentation"
                                          cellspacing="0"
                                          cellpadding="0"
                                          border="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style="
                                                  background: #ffffff;
                                                  font-size: 0px;
                                                  padding: 20px 0 0 0;
                                                  word-break: break-word;
                                                "
                                              >
                                                <p
                                                  style="
                                                    border-top: solid 1px #f5f5f5;
                                                    font-size: 1;
                                                    margin: 0px auto;
                                                    width: 100%;
                                                  "
                                                ></p>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div
                      style="
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 582px;
                      "
                      class="c--email-footer"
                    >
                      <table
                        style="
                          background: #ffffff;
                          background-color: #ffffff;
                          width: 100%;
                        "
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        align="center"
                      >
                        <tbody>
                          <tr>
                            <td
                              style="
                                border-left: 1px solid #f5f5f5;
                                border-right: 1px solid #f5f5f5;
                                direction: ltr;
                                font-size: 0px;
                                padding: 10px;
                                text-align: center;
                              "
                            >
                              <div
                                style="
                                  font-size: 0px;
                                  text-align: left;
                                  direction: ltr;
                                  display: inline-block;
                                  vertical-align: top;
                                  width: 100%;
                                "
                                class="mj-column-per-100 outlook-group-fix"
                              >
                                <table
                                  width="100%"
                                  role="presentation"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          background-color: #ffffff;
                                          vertical-align: top;
                                          padding: 10px 20px;
                                        "
                                      >
                                        <table
                                          width="100%"
                                          style=""
                                          role="presentation"
                                          cellspacing="0"
                                          cellpadding="0"
                                          border="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style="
                                                  font-size: 0px;
                                                  padding: 0px;
                                                  word-break: break-word;
                                                "
                                                class="c--text-subtext"
                                                align="left"
                                              >
                                                <div
                                                  style="
                                                    font-family: Helvetica, Arial,
                                                      sans-serif;
                                                    font-size: 11px;
                                                    line-height: 15px;
                                                    text-align: left;
                                                    color: #8f8f8f;
                                                  "
                                                >
                                                  <a
                                                    style="
                                                      color: #2a9edb;
                                                      font-weight: 500;
                                                      text-decoration: none;
                                                    "
                                                    href="https://2f4dbbde-1cae-486e-a535-5df820d0e5ff.ct0.app/r/pjawfjarx1mf4rhdcn14hj5chg7c"
                                                    class="c--link"
                                                    >Unsubscribe</a
                                                  >
                                                  |
                                                  <a
                                                    style="
                                                      color: #2a9edb;
                                                      font-weight: 500;
                                                      text-decoration: none;
                                                    "
                                                    href="https://2f4dbbde-1cae-486e-a535-5df820d0e5ff.ct0.app/r/a0wdwtrrrhmd32ppdb8gm2zp00mg"
                                                    class="c--link"
                                                    >Manage Your Preferences</a
                                                  >
                                                </div>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div
                      style="
                        border-radius: 0 0 7px 7px;
                        border-bottom: 1px solid #f5f5f5;
                        background: #ffffff;
                        background-color: #ffffff;
                        margin: 0px auto;
                        max-width: 582px;
                      "
                      class="c--email-footer c--courier-footer"
                    >
                      <table
                        style="
                          background: #ffffff;
                          background-color: #ffffff;
                          width: 100%;
                        "
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        align="center"
                      >
                        <tbody>
                          <tr>
                            <td
                              style="
                                border-left: 1px solid #f5f5f5;
                                border-right: 1px solid #f5f5f5;
                                direction: ltr;
                                font-size: 0px;
                                padding: 10px;
                                padding-top: 0;
                                text-align: center;
                              "
                            >
                              <div
                                style="
                                  font-size: 0px;
                                  text-align: left;
                                  direction: ltr;
                                  display: inline-block;
                                  vertical-align: top;
                                  width: 100%;
                                "
                                class="mj-column-per-100 outlook-group-fix"
                              >
                                <table
                                  width="100%"
                                  role="presentation"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          background-color: #ffffff;
                                          vertical-align: top;
                                          padding: 0px;
                                          padding-bottom: 10px;
                                        "
                                      >
                                        <table
                                          width="100%"
                                          style=""
                                          role="presentation"
                                          cellspacing="0"
                                          cellpadding="0"
                                          border="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style="
                                                  font-size: 0px;
                                                  padding: 0px;
                                                  word-break: break-word;
                                                "
                                                class="c--text-subtext"
                                                align="center"
                                              >
                                                <div
                                                  style="
                                                    font-family: Helvetica, Arial,
                                                      sans-serif;
                                                    font-size: 11px;
                                                    line-height: 15px;
                                                    text-align: center;
                                                    color: #8f8f8f;
                                                  "
                                                >
                                                  Powered By
                                                  <strong
                                                    ><a
                                                      style="
                                                        color: #2a9edb;
                                                        font-weight: 500;
                                                        text-decoration: none;
                                                      "
                                                      href="https://www.courier.com?utm_source=2f4dbbde-1cae-486e-a535-5df820d0e5ff&amp;utm_medium=email&amp;utm_campaign=courier-footer-referral"
                                                      >Courier</a
                                                    ></strong
                                                  >
                                                </div>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  `;
}
