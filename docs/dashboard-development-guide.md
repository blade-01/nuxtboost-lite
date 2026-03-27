# Dashboard Development Guide

This document explains how the dashboard codebase is structured, the conventions already in use, and the rules to follow when extending it.

It is meant for developers working inside the starter, not for end users.

## 1. What This Codebase Is

This project is a Nuxt-based starter for SaaS dashboards and admin interfaces.

The goal is not to model one finished product. The goal is to provide:

- reusable UI primitives
- consistent dashboard page structure
- auth flow scaffolding
- validation, feedback, and routing patterns
- production-leaning reference pages

When adding new features, preserve that intent. Prefer reusable patterns over one-off page logic.

## 2. Project Structure

### Pages

- `pages/index.vue`
  Public landing page for the starter
- `pages/auth/*`
  Auth flow pages
- `pages/dashboard/*`
  Dashboard pages and reference flows

### Layouts

- `layouts/default.vue`
  Public shell
- `layouts/auth.vue`
  Shared auth flow shell
- `layouts/dashboard.vue`
  Sidebar + topbar dashboard shell

### Components

- `components/Navigation/*`
  Sidebar, topbar, public header/footer
- `components/Dashboard/*`
  Shared page framing primitives such as page hero and content panels
- `components/Ui/*`
  Reusable starter UI components

### Composables

- `useAccessControl.ts`
  Role and access helpers
- `useAppFeedback.ts`
  Toast and modal abstraction
- `useCharts.ts`
  Chart data and options
- `useFetchApi.ts`
  Shared API request wrapper
- `usePvStyle.ts`
  PrimeVue pass-through styling
- `useShortcut.ts`
  Keyboard shortcut handling
- `useSidebarUtils.ts`
  Sidebar structure and group behavior
- `useUrlFilters.ts`
  URL-synced filter state for list/table pages
- `useValidations.ts`
  Shared Yup validation schemas

### Middleware

- `guest.ts`
  Blocks auth pages for already signed-in users
- `admin-only.ts`
  Admin-only route guard
- `role-access.ts`
  Generic role-based route guard

### Types

- `types/AuthUser.d.ts`
  Session/user shape
- response types in `types/*`

### Utilities

- `utils/index.ts`
  Formatting and helper functions used in templates and pages

## 3. Naming Rules

### Files and folders

- Use PascalCase for reusable component filenames
- Use kebab or route-style folders for pages
- Keep dashboard pages under `pages/dashboard/<feature>/index.vue`
- Keep auth pages under `pages/auth/<step>/index.vue`

### Components

- Prefix reusable primitives by domain when needed:
  - `Dashboard*` for dashboard shell helpers
  - `Navigation*` for navigation
  - `Ui*` for reusable controls

### Composables

- All composables should start with `use`
- A composable should own one concern
- If a composable becomes page-specific, move it into the page unless it will clearly be reused

## 4. Dashboard Page Rules

Each dashboard page should follow the same broad structure:

1. `definePageMeta({ layout: "dashboard" ... })`
2. `useHead({ title: "..." })`
3. Optional middleware and role restrictions
4. Reusable shared sections
5. Page-specific business logic

Preferred page primitives:

- `DashboardWrapper`
- `DashboardPageHero`
- `DashboardStarterPanel`
- `UiDataTable`

Do not build raw ad hoc page shells when the shared primitives already fit.

## 5. Role and Permission Rules

Permissions are controlled by:

- page metadata via `roles`
- `middleware: "role-access"`
- sidebar visibility rules in `useSidebarUtils.ts`

If a page is restricted:

```ts
definePageMeta({
  layout: "dashboard",
  middleware: "role-access",
  roles: ["admin", "member"]
})
```

If a sidebar link is restricted, add `roles` there too.

Do not rely on hiding links alone. If a page is restricted, it must also have route middleware.

## 6. Filter and Table Rules

For business-style list views, use `useUrlFilters.ts`.

That composable is the standard way to:

- keep filters in the URL
- restore filter state from shared links
- reset filters consistently
- support copyable filtered views

Reference implementation:

- `pages/dashboard/operations/index.vue`

If a new page has search, filter, pagination, or tabs that should be shareable, prefer URL-synced state.

## 7. Validation Rules

All validation schemas should live in `useValidations.ts` unless there is a strong reason not to.

Rules:

- reuse shared field builders when possible
- keep field labels human-readable
- keep page forms thin
- page files should consume schemas, not redefine them inline by default

Current shared auth and form schemas include:

- sign in
- sign up
- forgot password
- OTP
- reset password
- main input reference page schema

## 8. Auth Flow Rules

Current auth flow:

1. `/auth/signin`
2. `/auth/signup`
3. `/auth/forgot-password`
4. `/auth/otp`
5. `/auth/reset-password`

Current redirects:

- forgot password -> OTP
- OTP -> reset password
- reset password -> sign in
- sign in -> dashboard
- sign up -> sign in

If you add or change auth flow steps, keep them in `pages/auth/*` and preserve the shared `auth` layout.

## 9. Styling Rules

The UI direction already established is:

- light admin surface
- white/translucent cards and fields
- gray borders
- dark primary actions
- consistent field height and border treatment

Rules:

- reuse existing utility classes and field shells
- do not introduce a second visual language on new pages
- avoid inline style drift when a shared pattern already exists

PrimeVue usage should go through:

- shared pass-through styles in `usePvStyle.ts`
- wrapper components in `components/Ui/Input/*`

Do not mount raw PrimeVue inputs directly into pages unless there is a clear reason.

## 10. When to Create a New Component

Create a reusable component when:

- the same pattern appears in more than one page
- a page section has enough structure to be reused
- the page becomes noisy because too much markup is inline

Keep things local when:

- the logic is truly specific to one page
- extracting it would make the code harder to read

## 11. API and Data Rules

Use `useFetchApi.ts` for app requests.

When expanding the real backend integration:

- keep endpoint access inside composables or server handlers where possible
- avoid scattering raw `$fetch` calls across many pages
- type API responses in `types/*`

If a page is currently using mock data, keep the shape realistic and easy to swap for backend data later.

## 12. Utilities and Template Usage

Formatting helpers live in `utils/index.ts`.

Typical examples:

- `formatDate`
- `showRelativeTime`
- `formatCurrency`
- `getStatusBadge`

Use them consistently instead of duplicating formatting logic inside pages.

## 13. Recommended Pattern for New Dashboard Pages

For a new business page:

1. Create `pages/dashboard/<feature>/index.vue`
2. Add `definePageMeta`
3. Add `useHead`
4. Add role restrictions if needed
5. Use `DashboardWrapper`
6. Add `DashboardPageHero`
7. Add `DashboardStarterPanel` sections
8. Use shared input/table/modal primitives
9. If filters exist, use `useUrlFilters.ts`
10. Add sidebar entry in `useSidebarUtils.ts`

## 14. What Not to Do

- Do not bypass route access rules and only hide links
- Do not add raw one-off styling if a shared field/button/panel pattern already exists
- Do not place large ad hoc validation schemas directly inside pages unless the form is truly one-off
- Do not introduce dark-mode-specific styling patterns; the project is currently light-only
- Do not revert existing working starter behavior unless there is a clear bug

## 15. Entry Page Switching for New Projects

By default, the project uses the public landing page at `/` as the first page.

If a team wants the project to open on the sign-in screen first, the simplest starter-friendly option is to redirect `/` to `/auth/signin`.

Recommended quick change in `pages/index.vue`:

```vue
<script setup lang="ts">
await navigateTo("/auth/signin")
</script>
```

Alternative:

- keep `pages/index.vue` as the marketing/overview page and link to sign-in from there
- or replace the file completely with a redirect-only root page

If the product is fully auth-first, this is usually one of the first changes a new team should make.

## 16. Files Developers Should Learn First

If you are new to the project, read these first:

- `layouts/dashboard.vue`
- `components/Navigation/Sidebar.vue`
- `components/Navigation/Topbar.vue`
- `composables/useSidebarUtils.ts`
- `composables/useAccessControl.ts`
- `composables/useValidations.ts`
- `composables/useUrlFilters.ts`
- `pages/dashboard/operations/index.vue`
- `pages/auth/signin/index.vue`
- `README.md`

Those files explain most of the architecture and conventions already in use.
