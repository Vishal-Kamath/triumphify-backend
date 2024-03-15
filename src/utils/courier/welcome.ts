import { sendCourier } from "./courier";

export function welcomeToTriumphifyCourier({
  email,
  data,
}: {
  email: string;
  data: {
    userName: string;
  };
}) {
  return sendCourier({
    email,
    template: "6WD357P3ATMTZNGWBD4EFF3AQRZP",
    data,
  });
}
