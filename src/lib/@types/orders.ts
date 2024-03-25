export interface Order {
  id: string;
  user_id: string;
  group_id: string;

  product_id: string;
  product_name: string;
  product_slug: string;
  product_image: string | null;
  product_brand_name: string;
  product_description: string | null;
  product_quantity: number;

  product_variation_combinations: Record<string, string>;
  product_variation_discount: number;
  product_variation_discount_price: number;
  product_variation_discount_final_price: number;
  product_variation_price: number;
  product_variation_final_price: number;

  // order statuses
  request_cancel: boolean;
  request_return: boolean;
  cancelled: boolean;
  returned: boolean;

  status:
    | "pending"
    | "confirmed"
    | "out for delivery"
    | "delivered"
    | "return approved"
    | "out for pickup"
    | "picked up"
    | "refunded";

  created_at: Date;
  updated_at: Date | null;
}

export interface OrderDetails {
  id: string;
  user_id: string;

  // payment info
  sub_total: number;
  discount: number;
  coupon_code: string;
  coupon_discount: number;
  total: number;

  // shipping address info
  shipping_address_name: string;
  shipping_address_street_address: string;
  shipping_address_city: string;
  shipping_address_state: string;
  shipping_address_zip: string;
  shipping_address_country: string;
  shipping_address_tel: string;
  shipping_address_email: string;

  // billing address info
  billing_address_name: string;
  billing_address_street_address: string;
  billing_address_city: string;
  billing_address_state: string;
  billing_address_zip: string;
  billing_address_country: string;
  billing_address_tel: string;
  billing_address_email: string;

  created_at?: Date;
  updated_at?: Date | null;
}
