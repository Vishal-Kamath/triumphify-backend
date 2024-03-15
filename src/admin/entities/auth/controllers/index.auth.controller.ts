import handleLogin from "./login.auth.controller";
import handleSignOut from "./signout.auth.controller";
import handleResetPassword from "./resetPassword.employee.controller";
import handleSendResetPasswordLink from "./sendResetPassword.employee.controller";

export default {
  handleLogin,
  handleSignOut,
  handleSendResetPasswordLink,
  handleResetPassword,
};
