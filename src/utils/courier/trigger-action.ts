import { sendCourier } from "./courier";

export async function triggerAction({
  receivers,
  data,
}: {
  receivers: {
    userName: string;
    email: string;
  }[];
  data: {
    subject: string;
    body: string;
  };
}) {
  for (const user of receivers) {
    const { email, userName } = user;
    await sendCourier({
      email,
      template: "GH5BWFZRDN4QB3JT87ENT452A7JG",
      data: {
        ...data,
        userName,
      },
    });
  }
}
