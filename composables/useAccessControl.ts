export type AppRole = "admin" | "member" | "staff" | "user";

export function normalizeRoles(input: unknown): AppRole[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const allowedRoles: AppRole[] = ["admin", "member", "staff", "user"];

  return input
    .map((item) => String(item).toLowerCase())
    .filter((item): item is AppRole => allowedRoles.includes(item as AppRole));
}

export default function useAccessControl(): {
  currentRoles: ComputedRef<AppRole[]>;
  primaryRole: ComputedRef<AppRole>;
  canAccess: (requiredRoles?: AppRole[]) => boolean;
} {
  const { data, status } = useAuth();

  const currentRoles = computed<AppRole[]>(() => {
    const roles = normalizeRoles((data.value as any)?.user?.roles);

    if (roles.length > 0) {
      return roles;
    }

    // Starter fallback so the dashboard remains explorable before auth is wired.
    if (status.value !== "authenticated") {
      return ["admin"];
    }

    return [];
  });

  const primaryRole = computed<AppRole>(() => currentRoles.value[0] || "user");

  const canAccess = (requiredRoles?: AppRole[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    return requiredRoles.some((role) => currentRoles.value.includes(role));
  };

  return {
    currentRoles,
    primaryRole,
    canAccess,
  };
}
