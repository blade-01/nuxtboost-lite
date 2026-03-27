export default {
  auth: {
    signIn: "/portaluser/portaluser/login",
    signUp: "/portaluser/portaluser/sign-up",
    verifyEmail: "/portaluser/portaluser/verify-email",
    resendVerificationEmail: "/portaluser/portaluser/resend-verification-email",
    requestPasswordReset: "/portaluser/portaluser/request-password-reset",
    validatePasswordResetCode: "/portaluser/portaluser/valid-password-reset",
    resetPassword: "/portaluser/portaluser/reset-password",
    signOut: "/portaluser/portaluser/logout"
  },
  user: {
    me: "/portaluser/portaluser/me",
    update: "/portaluser/portaluser/user-update",
    getAll: "/portaluser/portaluser/",
    enum: "/app/enum/user"
  }
}
