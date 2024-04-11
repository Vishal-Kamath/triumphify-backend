import e, { Request, Response } from "express";
import { RequestPlaceOrders } from "../validators.orders";
import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import {
  DbOrders,
  addresses,
  cart,
  order_details,
  orders,
  product_variations,
  products,
  users,
} from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { Cart } from "@/lib/@types/cart";
import { Logger } from "@/utils/logger";
import sendEmail from "@/utils/mailer/mailer";
import { orderPlacedMailFormat } from "@/utils/mailer/order.mail";
import { OrderDetails } from "@/lib/@types/orders";
import { lowStockAlert } from "@/utils/courier/low-stock-alert";
import { env } from "@/config/env.config";
import { orderPlacedMailToAdmin } from "@/utils/mailer/order.admin.mail";

function getTotals(cart: Cart[]) {
  const subTotal = parseFloat(
    cart
      .reduce(
        (subTotal, curr) => subTotal + curr.variation.price * curr.quantity,
        0
      )
      .toFixed(2)
  );
  const discount = parseFloat(
    cart
      .reduce(
        (discount, curr) =>
          discount +
          curr.variation.price *
            (curr.variation.discount / 100) *
            curr.quantity,
        0
      )
      .toFixed(2)
  );

  const total = subTotal - discount;

  return { subTotal, discount, total };
}

const handlePlaceOrders = async (
  req: Request<{}, {}, RequestPlaceOrders & TokenPayload>,
  res: Response
) => {
  try {
    const { shippingAddress, billingAddress } = req.body;
    const { id } = req.body.token;

    const findUser = (
      await db.select().from(users).where(eq(users.id, id)).limit(1)
    )[0];
    if (!findUser) {
      return res.status(404).send({
        description: "User not found",
        type: "error",
      });
    }

    const findShippingAddress = (
      await db
        .select()
        .from(addresses)
        .where(
          and(eq(addresses.id, shippingAddress), eq(addresses.user_id, id))
        )
    )[0];
    const findBillingAddress = (
      await db
        .select()
        .from(addresses)
        .where(and(eq(addresses.id, billingAddress), eq(addresses.user_id, id)))
    )[0];

    if (!findShippingAddress || !findBillingAddress) {
      return res.status(404).send({
        description: "Address not found",
        type: "error",
      });
    }

    const carts = (await db
      .select({
        id: cart.id,
        product: products,
        variation: product_variations,
        quantity: cart.quantity,
      })
      .from(cart)
      .where(eq(cart.user_id, id))
      .leftJoin(products, eq(products.id, cart.product_id))
      .leftJoin(
        product_variations,
        and(
          eq(product_variations.id, cart.product_variation_id),
          eq(product_variations.product_id, cart.product_id)
        )
      )) as Cart[];

    if (!carts.length) {
      return res.status(404).send({
        description: "Cart is empty",
        type: "error",
      });
    }

    // check if all products and variations are valid
    const errorProducts: string[] = [];
    const newCarts = carts.filter((cart) => {
      if (
        !cart.product ||
        !cart.variation ||
        cart.variation.quantity - cart.quantity < 0
      ) {
        errorProducts.push(cart.product.name);
      }
      return (
        !!cart.product &&
        !!cart.variation &&
        cart.variation.quantity - cart.quantity >= 0
      );
    });

    if (errorProducts.length) {
      return res.status(404).send({
        description: `Product ${errorProducts.join(", ")} is out of stock`,
        type: "error",
      });
    }

    const { subTotal, discount, total } = getTotals(newCarts);

    const order_group_id = uuid();
    const date = new Date();

    const new_order_details: OrderDetails = {
      id: order_group_id,
      user_id: id,

      sub_total: subTotal,
      discount,
      coupon_code: "",
      coupon_discount: 0,
      total,

      shipping_address_name: findShippingAddress.name,
      shipping_address_street_address: findShippingAddress.street_address,
      shipping_address_city: findShippingAddress.city,
      shipping_address_state: findShippingAddress.state,
      shipping_address_country: findShippingAddress.country,
      shipping_address_zip: findShippingAddress.zip,
      shipping_address_tel: findShippingAddress.tel,
      shipping_address_email: findShippingAddress.email,

      billing_address_name: findBillingAddress.name,
      billing_address_street_address: findBillingAddress.street_address,
      billing_address_city: findBillingAddress.city,
      billing_address_state: findBillingAddress.state,
      billing_address_country: findBillingAddress.country,
      billing_address_zip: findBillingAddress.zip,
      billing_address_tel: findBillingAddress.tel,
      billing_address_email: findBillingAddress.email,

      created_date: date,
    };

    const new_orders = newCarts.map((cart) => ({
      id: uuid(),
      group_id: order_group_id,
      user_id: id,

      product_id: cart.product.id,
      product_name: cart.product.name,
      product_brand_name: cart.product.brand_name,
      product_slug: cart.product.slug,
      product_description: cart.product.description,
      product_image: cart.product.product_images[0],
      product_quantity: cart.quantity,

      product_variation_key: cart.variation.key,
      product_variation_combinations: cart.variation.combinations,
      product_variation_price: cart.variation.price,
      product_variation_final_price:
        cart.quantity *
        cart.variation.price *
        ((100 - cart.variation.discount) / 100),
      product_variation_discount: cart.variation.discount,
      product_variation_discount_price:
        (cart.variation.price * cart.variation.discount) / 100,
      product_variation_discount_final_price:
        cart.quantity *
        ((cart.variation.price * cart.variation.discount) / 100),

      status: "pending",
      cancelled: false,
      returned: false,

      created_date: date,
    })) as DbOrders[];

    await db.transaction(async (trx) => {
      // create order details
      await trx.insert(order_details).values(new_order_details);

      // create orders
      await trx.insert(orders).values(new_orders);

      // update product variations
      for (const cart of newCarts) {
        const newQuantity = cart.variation.quantity - cart.quantity;
        await trx
          .update(product_variations)
          .set({
            quantity: newQuantity,
          })
          .where(eq(product_variations.id, cart.variation.id));

        if (newQuantity < 30) {
          lowStockAlert({
            data: {
              redirect: `${env.ADMIN_WEBSITE}/products/details/${cart.product.id}`,
              productName: cart.product.name,
              variation: Object.keys(
                cart.variation.combinations as Record<string, string>
              )
                .map(
                  (val) =>
                    `${val}: ${
                      (cart.variation.combinations as Record<string, string>)[
                        val
                      ]
                    }`
                )
                .join(" | "),
              quantity: newQuantity.toString(),
            },
          });
        }
      }
    });

    await db.delete(cart).where(eq(cart.user_id, id));

    // Send email
    await sendEmail({
      email: findUser.email,
      message: orderPlacedMailFormat({
        orders: new_orders,
        order_details: new_order_details,
        userName: findUser.username || "Customer",
      }),
      subject: "Order Placed Successfully 🎉",
    });
    orderPlacedMailToAdmin({
      orders: new_orders,
      order_details: new_order_details,
    });

    return res.status(200).send({
      title: "Success",
      description: "Order placed successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle place orders error", err);
    return res.status(500).send({
      description: "Something went wrong",
      type: "error",
    });
  }
};

export default handlePlaceOrders;
