// Install with: npm install @trycourier/courier
import { env } from "@/config/env.config";
import { CourierClient } from "@trycourier/courier";

const courier = new CourierClient({
  authorizationToken: env.COURIER_AUTH_TOKEN,
});

export async function sendCourier({
  email,
  template,
  data,
}: {
  email: string;
  template: string;
  data: object;
}) {
  const { requestId } = await courier.send({
    message: {
      to: {
        email,
      },
      template,
      data,
    },
  });
}
