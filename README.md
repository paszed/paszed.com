# paszed.com

Personal website and project portfolio built with Next.js, React, and TypeScript.

**Website:** [paszed.com](https://paszed.com)

The site brings together my work, technical background, and projects in a multilingual interface. It includes interactive components, 3D experiences, structured SEO metadata, and a first-party analytics system.

## Technology

| Area | Stack |
| --- | --- |
| Application | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| 3D | Three.js, React Three Fiber, Drei |
| Animation | Framer Motion |
| Data | Supabase |
| Testing | Vitest, Testing Library, Playwright |
| Tooling | ESLint, Knip, Dependency Cruiser, Lighthouse CI |
| Package manager | pnpm 10 |

## Architecture

The application is organized around independently maintained features and shared capabilities.

```text
src/
  analytics/    First-party analytics collection, processing, and reporting
  app/          Routes, layouts, metadata, and API endpoints
  brand/        Brand components and assets
  config/       Site and application configuration
  content/      Localized content
  features/     Feature-specific components and logic
  i18n/         Internationalization and locale routing
  layout/       Shared page layout
  lib/          Shared integrations and utilities
  providers/    Application-level providers
  types/        Shared TypeScript types
  ui/           Reusable interface components

tests/
  unit/         Additional unit tests
  e2e/          Browser-based end-to-end tests

scripts/        Development and analytics utilities
```

The site supports English, German, and Hungarian. Analytics is implemented within the application rather than relying exclusively on an external analytics dashboard.

## Local development

**Prerequisites:** Node.js and pnpm 10.

```sh
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Local environment configuration is stored in `.env.local`, which is not committed to the repository. Required environment variables and credentials are not included in this README.

## Quality and verification

The project uses automated checks for code quality, type safety, test coverage, production builds, browser behavior, unused code, and architectural boundaries.

```sh
pnpm check
```

The verification pipeline runs ESLint, TypeScript, Vitest with coverage, a production build, Playwright, Knip, Dependency Cruiser, and a dependency deduplication check.

`pnpm verify` is an alias for `pnpm check`.

**Latest verified result:** 475 unit and component tests passed, 21 end-to-end tests passed, and the measured codebase reached 100% statement, branch, function, and line coverage.

Coverage describes the code exercised by the configured test suite; it does not establish that every possible runtime failure has been eliminated.

## Available commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run unit and component tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm e2e` | Run end-to-end tests |
| `pnpm e2e:ui` | Open the Playwright test UI |
| `pnpm architecture` | Check dependency boundaries |
| `pnpm knip` | Check for unused code and dependencies |
| `pnpm lighthouse` | Run Lighthouse CI |
| `pnpm analyze` | Build with bundle analysis enabled |
| `pnpm check` | Run the full verification pipeline |

## Deployment

Create an optimized production build with `pnpm build` and serve it with `pnpm start`, or deploy through a compatible Next.js hosting platform.

Configure the required environment variables in the deployment environment. Do not commit `.env.local` or credentials to the repository.
