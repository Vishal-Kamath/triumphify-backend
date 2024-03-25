// Install with: npm install @trycourier/courier
import { sendCourier } from "./courier";

export function orderStatusUpdateEmail({
  email,
  data,
}: {
  email: string;
  data: {
    userName: string;
    redirect: string;
    status: string;
    message: string;
  };
}) {
  return sendCourier({
    email,
    template: "ZPAQRXJMTV4F7GGSTJ01M62GEJTV",
    data,
  });
}

export function generateOrderStatusMessage(status: string): string {
  switch (status) {
    case "pending":
      return "We have received your order and are currently processing it. Thank you for choosing us!";
    case "confirmed":
      return "We are happy to inform you that your order has been confirmed. It's on its way to you soon!";
    case "out for delivery":
      return "Exciting news! Your order is now out for delivery. Keep an eye out for our delivery person.";
    case "delivered":
      return "Great news! Your order has been successfully delivered. We hope you enjoy your purchase!";
    case "return approved":
      return "Your return request has been approved. Please prepare the item for pickup.";
    case "out for pickup":
      return "Our team is on their way to pick up your return item. Please ensure it's ready for collection.";
    case "picked up":
      return "Your return item has been picked up. We will process your refund shortly.";
    case "refunded":
      return "Your refund has been processed successfully. Please check your account for the credited amount.";
    default:
      return "We apologize, but we couldn't find information about your order status at the moment.";
  }
}
