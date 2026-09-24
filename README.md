# paszed.com

Personal website and project portfolio, built with Next.js and TypeScript.

The site includes localized content, project and specification pages, interactive UI, SEO metadata, and a first-party analytics implementation.

## Stack

- Next.js 16, React 19, and TypeScript
- Tailwind CSS 4
- React Three Fiber, Drei, and Three.js for 3D experiences
- Framer Motion for animation
- Supabase client integration
- Vitest and Testing Library for unit and component tests
- Playwright for end-to-end tests

Package manager: **pnpm 10**.

## Local development

Install dependencies and start the development server:

```sh
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The project uses `.env.local` for local environment configuration. This file is not included in the repository; obtain the required variable names and values from the project maintainer.

## Project structure

```text
src/
  analytics/    First-party analytics: collection, context, events, and reporting logic
  app/          Next.js routes, layouts, and API endpoints
  brand/        Brand assets and configuration
  config/       Application configuration
  content/      Localized page content
  features/     Page and feature implementations
  i18n/         Internationalization utilities
  layout/       Shared page layout
  lib/          Shared libraries, including SEO and Supabase
  providers/    Application providers
  types/        Shared TypeScript types
  ui/           Reusable interface components
tests/
  unit/         Dedicated unit tests
scripts/        Analytics smoke-test scripts
```

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Check TypeScript types |
| `pnpm test` | Run Vitest once |
| `pnpm test:watch` | Run Vitest in watch mode |
| `pnpm test:coverage` | Run tests with coverage reporting |
| `pnpm e2e` | Run Playwright end-to-end tests |
| `pnpm e2e:ui` | Open the Playwright test UI |
| `pnpm architecture` | Check source dependency rules |
| `pnpm knip` | Check for unused code and dependencies |
| `pnpm lighthouse` | Run Lighthouse CI |
| `pnpm analyze` | Build with the bundle analyzer enabled |
| `pnpm check` | Run the configured project verification pipeline |

The `pnpm verify` command is an alias for `pnpm check`. The full pipeline runs linting, typechecking, coverage, a production build, end-to-end tests, Knip reporting, architecture checks, and a dependency deduplication check.

## Testing

Unit tests live alongside some source modules and in `tests/unit/`. End-to-end tests use Playwright. Run the fast checks during development:

```sh
pnpm lint
pnpm typecheck
pnpm test
```

Run `pnpm test:coverage` to generate the coverage report. Test coverage is being expanded across the project; a passing test suite does not imply complete coverage.

## Analytics

The `src/analytics/` directory contains the site analytics implementation, including browser event collection, session handling, contextual information, and server-side event processing. Related smoke-test scripts are available in `scripts/`.

## Deployment

Create a production build with `pnpm build` and run it with `pnpm start`. Configure the required environment variables in the target deployment environment.
