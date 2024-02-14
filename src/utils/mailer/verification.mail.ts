export const emailVerificationMailFormat = (otp: string) => {
  return `
    <div>
      <strong>Your One Time Password (OTP) for email verification: ${otp}</strong>
      <p>OTP is valid only for 05:00 mins. Do not share this OTP with anyone.</p>
    </div>
  `;
};
