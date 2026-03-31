# NuxtBoost

NuxtBoost is a Nuxt starter for SaaS dashboards and admin interfaces.

It is designed for teams that want to skip repetitive setup work and start from a clean, reusable foundation with:

- dashboard shell and navigation
- auth screens
- reusable form inputs and validations
- charts, tables, modals, and feedback flows
- starter business flows like overview, operations, charts, tables, forms, and modals

## What This Starter Includes

### Core stack

- Nuxt 4
- TypeScript
- Tailwind CSS
- PrimeVue 4
- VeeValidate + Yup
- Nuxt Image
- Nuxt Icon
- Sidebase Nuxt Auth

### UI foundations

- dashboard layout with responsive sidebar and topbar
- reusable button, modal, table, and input primitives
- validated auth pages
- chart surfaces with Chart.js
- toast and confirmation flows

### Starter pages

- dashboard overview
- charts
- operations flow
- input reference
- table reference
- modal reference
- button reference

## Project Structure

```txt
components/
  Dashboard/
  Navigation/
  Ui/
composables/
layouts/
middleware/
pages/
  auth/
  dashboard/
plugins/
server/
types/
utils/
```

## Key Reusable Pieces

### Components

- `components/Ui/Btn/index.vue`
- `components/Ui/Data/Table.vue`
- `components/Ui/Input/*`
- `components/Ui/Modal/*`
- `components/Dashboard/PageHero.vue`
- `components/Dashboard/StarterPanel.vue`

### Composables

- `composables/useAppFeedback.ts`
- `composables/useErrorMessage.ts`
- `composables/useFetchApi.ts`
- `composables/usePvStyle.ts`
- `composables/useSidebarUtils.ts`
- `composables/useShortcut.ts`
- `composables/useValidations.ts`

### Utilities

- `utils/index.ts`

## Getting Started

Install dependencies:

```bash
yarn install
```

Start development:

```bash
yarn dev
```

Build for production:

```bash
yarn build
```

Run linting:

```bash
yarn lint
```

Run auto-fixes:

```bash
yarn lint:fix
yarn format
```

Run verification checks:

```bash
yarn format:check
yarn typecheck
```

Preview production output:

```bash
yarn preview
```

## Documentation

Project documentation for developers working on the dashboard lives here:

- `docs/dashboard-development-guide.md`

That guide covers:

- file structure
- naming rules
- composables and shared patterns
- role access conventions
- validation rules
- how to add new dashboard pages
- how to switch the project from overview-first to auth-first

Contributor workflow and repository rules live here:

- `CONTRIBUTING.md`

## Switching The First Page

By default, `/` renders the public overview page in `pages/index.vue`.

If a developer wants the project to open on the sign-in page first, the fastest way is to turn `pages/index.vue` into a redirect:

```vue
<script setup lang="ts">
await navigateTo("/auth/signin");
</script>
```

That keeps the rest of the auth flow intact while making sign-in the first page a user sees.

Auth flow implementation details, including `definePageMeta`, `@sidebase/nuxt-auth`,
guest middleware, and protected-page rules, are documented in
`docs/dashboard-development-guide.md`.

## Recommended First Edits

When using this starter for a new product, update these first:

1. `nuxt.config.ts`
2. `public/` assets and favicon
3. sidebar links in `composables/useSidebarUtils.ts`
4. auth and session wiring in `server/api/auth/[...].ts`
5. decide whether `/` should stay as the overview page or redirect to `/auth/signin`
6. starter copy and business metrics in `pages/dashboard/*`

## Code Quality Tooling

This repo now includes:

- ESLint with Nuxt-aware flat config
- Prettier with Tailwind class sorting
- EditorConfig for base editor consistency
- Husky + lint-staged for pre-commit formatting and linting

The pre-commit hook runs on staged files only. For a full check, run:

```bash
yarn lint
yarn format:check
yarn typecheck
yarn build
```

## Starter Philosophy

This repo is not meant to be a finished SaaS product.

It is meant to provide:

- consistent UI primitives
- sensible route structure
- production-leaning starter pages
- reusable validation and feedback patterns
- a cleaner starting point than a blank Nuxt app
- error-aware toast handling via `useAppFeedback()` and `useErrorMessage()`

## Notes

- The repo currently builds successfully with `yarn build`.
- There are still some non-blocking upstream warnings during build, including the `fs.Stats` deprecation from the vee-validate dependency chain and bundle-size warnings for larger chunks.
