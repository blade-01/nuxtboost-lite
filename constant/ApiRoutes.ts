export default {
  auth: {
    signIn: "/auth/login",
    signUp: "/auth/sign-up",
    verifyEmail: "/auth/verify-email",
    resendVerificationEmail: "/auth/resend-verification-email",
    requestPasswordReset: "/auth/request-password-reset",
    validatePasswordResetCode: "/auth/valid-password-reset",
    resetPassword: "/auth/reset-password",
    signOut: "/auth/logout",
  },
  user: {
    me: "/me",
    update: "/user-update",
    enum: "/app/enum/user",
  },
};
