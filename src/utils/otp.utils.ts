function otpBuilder(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let otp = "";

  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters.charAt(randomIndex);
  }

  return otp;
}

export function generateOTP(): string {
  const otp = otpBuilder();
  if (otp.length !== 7) {
    return generateOTP();
  } else {
    return otp;
  }
}
