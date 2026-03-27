import type { AppRole } from "~/composables/useAccessControl"

export type SidebarSection = {
  type: "section"
  name: string
}

export type SidebarLink = {
  type: "link"
  name: string
  route: string
  icon?: string
  roles?: AppRole[]
}

export type SidebarGroup = {
  type: "group"
  name: string
  show?: boolean
  icon?: string
  roles?: AppRole[]
  sub: SidebarLink[]
}

type SidebarEntry = SidebarSection | SidebarLink | SidebarGroup

export default function useSidebarUtils(): {
  links: Ref<SidebarEntry[]>
  visibleLinks: ComputedRef<SidebarEntry[]>
  toggleDropdown: (item: SidebarGroup) => void
} {
  const { canAccess } = useAccessControl()

  const links = ref<SidebarEntry[]>([
    {
      type: "link",
      name: "Dashboard",
      icon: "mdi:view-dashboard",
      route: "/dashboard",
      roles: ["admin", "member", "staff", "user"]
    },
    {
      type: "section",
      name: "Analytics"
    },
    {
      type: "link",
      name: "Charts",
      icon: "mdi:chart-line",
      route: "/dashboard/charts",
      roles: ["admin", "member", "staff", "user"]
    },
    {
      type: "link",
      name: "Operations",
      icon: "mdi:clipboard-text-clock-outline",
      route: "/dashboard/operations",
      roles: ["admin", "member", "staff"]
    },
    {
      type: "group",
      name: "Components",
      icon: "icon-park-outline:figma-component",
      show: false,
      sub: [
        {
          type: "link",
          name: "Button Samples",
          icon: "mdi:gesture-tap-button",
          route: "/dashboard/button",
          roles: ["admin", "member", "staff"]
        },
        {
          type: "link",
          name: "Input Samples",
          icon: "mdi:form-select",
          route: "/dashboard/input",
          roles: ["admin", "member", "staff"]
        },
        {
          type: "link",
          name: "Modal Samples",
          icon: "mdi:help-box-multiple-outline",
          route: "/dashboard/modal",
          roles: ["admin", "member", "staff"]
        },
        {
          type: "link",
          name: "Table Samples",
          icon: "mdi:table",
          route: "/dashboard/table",
          roles: ["admin", "member", "staff"]
        }
      ]
    }
  ])

  const visibleLinks = computed<SidebarEntry[]>(() => {
    const result: SidebarEntry[] = []
    let pendingSection: SidebarSection | null = null

    links.value.forEach((entry) => {
      if (entry.type === "section") {
        pendingSection = entry
        return
      }

      if (entry.type === "link") {
        if (!canAccess(entry.roles)) {
          return
        }

        if (pendingSection) {
          result.push(pendingSection)
          pendingSection = null
        }

        result.push(entry)
        return
      }

      const visibleSubLinks = entry.sub.filter((sub) => canAccess(sub.roles))

      if (!visibleSubLinks.length || !canAccess(entry.roles)) {
        return
      }

      if (pendingSection) {
        result.push(pendingSection)
        pendingSection = null
      }

      result.push({
        ...entry,
        sub: visibleSubLinks
      })
    })

    return result
  })

  const toggleDropdown = (item: SidebarGroup): void => {
    const target = links.value.find(
      (entry): entry is SidebarGroup => entry.type === "group" && entry.name === item.name
    )

    if (!target) {
      return
    }

    target.show = !target.show
  }

  return { links, visibleLinks, toggleDropdown }
}
