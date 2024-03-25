import { env } from "@/config/env.config";
import { OrderDetails } from "@/lib/@types/orders";
import { DbOrders } from "@/lib/db/schema";

export function orderPlacedMailFormat({
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
                            ).length + 4
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
                                                          src="https://triumphify.com/logo.svg"
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
                                                Thank you for your recent purchase with Triumphify. We are excited to confirm that your order has been successfully received and is now being processed. Below are the details of your order:
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

          <img
            src="https://2f4dbbde-1cae-486e-a535-5df820d0e5ff.ct0.app/o/nh7hk07962m4npj4jfr1cnbabm3z.gif"
          />
        </div>
      </body>
    </html>
  `;
}
