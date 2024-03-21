import { sendCourier } from "./courier";

export function resetPasswordEmail({
  email,
  data,
}: {
  email: string;
  data: {
    redirect: string;
    userName: string;
  };
}) {
  return sendCourier({
    email,
    template: "FAP8EVD536MMQYPZXN4QMD4FK9GX",
    data,
  });
}
