import { sendCourier } from "./courier";

export function cancelOrderEmail({
  email,
  data,
}: {
  email: string;
  data: {
    userName: string;
    orderDate: string;
    redirect: string;
  };
}) {
  return sendCourier({
    email,
    template: "2282HA3JHZ40ENQA0Z12PYZ21XXS",
    data,
  });
}
