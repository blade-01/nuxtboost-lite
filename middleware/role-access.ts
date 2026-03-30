import type { AppRole } from "~/composables/useAccessControl";

export default defineNuxtRouteMiddleware((to) => {
  const requiredRoles = to.meta.roles as AppRole[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return;
  }

  const { canAccess, currentRoles } = useAccessControl();

  if (canAccess(requiredRoles)) {
    return;
  }

  throw showError({
    statusCode: 403,
    statusMessage: "Access denied",
    message: `This page is restricted to: ${requiredRoles.join(", ")}. Current role: ${currentRoles.value.join(", ") || "none"}.`,
    fatal: true,
  });
});
