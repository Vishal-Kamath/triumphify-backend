import handleSignOut from "./signout.user.controller";
import handleLogin from "./login.user.controller";
import handleSignUp from "./signup.user.controller";
import handleSendResetPasswordLink from "./sendResetPassword.employee.controller";
import handleResetPassword from "./resetPassword.employee.controller";
import handleGoogleAuth from "./google.auth.controller";

export default {
  handleSignUp,
  handleLogin,
  handleSignOut,
  handleSendResetPasswordLink,
  handleResetPassword,
  handleGoogleAuth,
};
