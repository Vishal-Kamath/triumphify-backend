export const resetPasswordFormat = (link: string) => {
  return `
    <div>
      <strong>Your One Time reset password link for resetting password: ${link}</strong>
      <p>Link is valid only for 15:00 mins</p>
      <strong style="color: red; font-size: 2rem;">NOTE: Do not share this link with anyone.</strong>
    </div>
  `;
};
