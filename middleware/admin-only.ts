/**
 * Only allow admin users to access the page
 */

export default defineNuxtRouteMiddleware(() => {
  const { canAccess } = useAccessControl()

  if (!canAccess(["admin"])) {
    throw showError({
      statusCode: 403,
      statusMessage: "Access denied",
      message: "You do not have permission to access this page.",
      fatal: true
    })
  }
})
