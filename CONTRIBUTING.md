# Contributing

This starter is meant to be a clean, reusable base for SaaS dashboards and admin interfaces.

Before making changes, read:

- [README.md](/Users/blade/Documents/Work/GetPayed/payed-admin/README.md)
- [docs/dashboard-development-guide.md](/Users/blade/Documents/Work/GetPayed/payed-admin/docs/dashboard-development-guide.md)

## Local Setup

```bash
yarn install
yarn dev
```

Useful project checks:

```bash
yarn lint
yarn lint:fix
yarn format
yarn format:check
yarn typecheck
yarn build
```

## Contribution Rules

- Keep changes aligned with the starter-pack goal. Prefer reusable patterns over one-off page code.
- Do not introduce duplicate UI patterns when an existing wrapper or composable already solves the same problem.
- Prefer extending `components/Ui`, `components/Dashboard`, `composables`, or `utils` before adding inline page logic.
- Keep file names consistent with the current codebase. Use PascalCase for Vue components and camelCase for composables and utilities.
- Preserve the established light dashboard UI unless the task explicitly changes the design system.
- Avoid hardcoding role checks or route filters in templates when shared composables already exist.
- Keep route, validation, and feedback logic centralized where possible.

## Styling Rules

- Use Tailwind utility classes and the shared `app-` control classes before adding page-specific styling.
- For third-party inputs, prefer wrapper components and shared CSS contracts instead of per-page overrides.
- Keep PrimeVue, Vue Datepicker, and Vue Tel Input styling aligned with the shared field baseline.

## Forms And Validation

- Use the shared validation helpers in `composables/useValidations.ts`.
- Prefer reusable input wrappers from `components/Ui/Input`.
- Do not add ad hoc validation logic inside pages when it can live in the shared schema layer.

## Tables And Filters

- Reuse the table and filter patterns already established in the dashboard pages.
- When filters should be shareable, use `composables/useUrlFilters.ts` so state stays in the URL.
- Include realistic loading, empty, and filtered states for business-facing flows.

## Auth And Routing

- Keep auth flow redirects consistent: forgot password -> OTP -> reset password -> sign in.
- If a page should be role-restricted, use the shared access-control approach instead of custom conditionals.
- If you want sign-in to be the first page instead of the public overview, update `pages/index.vue` to redirect to `/auth/signin`.

## Commit Quality

- Run `yarn lint`, `yarn format:check`, `yarn typecheck`, and `yarn build` before opening a PR.
- Husky + lint-staged will format and lint staged files on commit, but that is not a replacement for a full check.
- Keep changes focused. Avoid mixing unrelated refactors with feature work.

## Pull Request Notes

Include:

- what changed
- why it changed
- any follow-up work or known limitations
- screenshots when the change affects visible UI
