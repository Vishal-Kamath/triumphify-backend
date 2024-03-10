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
} from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { Cart } from "@/lib/@types/cart";
import { Logger } from "@/utils/logger";

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
            curr.variation.quantity,
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

    await db.transaction(async (trx) => {
      // create order details
      const order_group_id = uuid();
      await trx.insert(order_details).values({
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
      });

      // create orders
      await trx.insert(orders).values(
        newCarts.map((cart) => ({
          id: uuid(),
          group_id: order_group_id,
          user_id: id,

          product_name: cart.product.name,
          product_brand_name: cart.product.brand_name,
          product_slug: cart.product.slug,
          product_description: cart.product.description,
          product_image: cart.product.product_images[0],
          product_quantity: cart.quantity,

          product_variation_combinations: cart.variation.combinations,
          product_variation_price: cart.variation.price,
          product_variation_discount: cart.variation.discount,

          status: "pending",
          cancelled: false,
          request_cancel: false,
          request_return: false,
          returned: false,
        })) as DbOrders[]
      );

      // update product variations
      for (const cart of newCarts) {
        await trx
          .update(product_variations)
          .set({
            quantity: cart.variation.quantity - cart.quantity,
          })
          .where(eq(product_variations.id, cart.variation.id));
      }
    });

    await db.delete(cart).where(eq(cart.user_id, id));

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
