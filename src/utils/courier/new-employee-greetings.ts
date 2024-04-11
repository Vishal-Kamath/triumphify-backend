import { sendCourier } from "./courier";

export async function newEmployeeGreetings({
  email,
  data,
}: {
  email: string;
  data: {
    userName: string;
    loginEmail: string;
    password: string;
  };
}) {
  await sendCourier({
    email,
    data: {
      userName: data.userName,
      loginEmail: data.loginEmail,
      password: data.password,
    },
    template: "5JXMC41SK3M191Q1NYCWTFYRT5PV",
  });
}
