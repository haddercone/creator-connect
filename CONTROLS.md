# Creator Connect — Engineering Controls

This file is the authoritative specification for the tech stack, architecture, and design principles of the Creator Connect Q&A platform. `AGENTS.md` instructs agents to follow these controls. If they ever disagree, this file wins.

## Tech Stack

| Layer        | Technology                                          | Version / Notes                          |
| ------------ | --------------------------------------------------- | ---------------------------------------- |
| Framework    | Next.js (App Router, Turbopack)                     | 16.3.3                                   |
| UI           | React + React DOM                                   | ^18                                      |
| Language     | TypeScript (strict mode)                            | ^5                                       |
| Styling      | Tailwind CSS                                        | ^3.3.0, no `tailwind.config` plugins     |
| ORM / DB     | Prisma + MongoDB                                    | ^5.7.1, `@db.ObjectId` primary keys      |
| Auth         | Next-Auth                                           | ^4.24.14 (GitHub + Twitter providers)    |
| Validation   | Zod                                                 | ^3.22.4, `safeParse` at every boundary   |
| Rate limiting| Prisma count (`Question.submitterKey`)             | 2 questions / 60 min per creator         |
| Client state | Recoil                                              | ^0.7.7                                   |
| Notifications| react-hot-toast                                     | ^2.4.1                                   |
| Icons        | react-icons                                         | ^4.12.0                                  |
| Lint         | ESLint + `eslint-config-next`                       | ^8 / 14.0.4                              |
| Runtime      | Node.js                                             | >= 24.0.0                                |

## Commands

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` — `prisma generate` then `next build`
- `npm run start` — production server
- `npm run lint` — `eslint .`

## Project Structure

```
src/
  app/                 # App Router routes, layouts, and pages
    actions/           # Server Actions (mutations)
    api/               # Route handlers (public read APIs)
    dashboard/         # Authenticated workspace (+ admin subset)
  components/          # Shared UI components; barrel export in components/index.ts
    skeletons/         # Loading-state components
  hooks/               # Shared hooks; barrel export in hooks/index.ts
  lib/                 # Pure logic: types (Zod), helpers, mongo data-access layer
  server/db/           # PrismaClientSingleton
  config/              # Static configuration (e.g. rate-limit values)
prisma/schema.prisma   # Prisma schema + MongoDB datasource
```

## Architecture

- **Pages** are Server Components by default; components that need interactivity opt in with `"use client"`.
- **Mutations** are Server Actions: `src/app/actions/actions.ts` (question + answer flows) and `src/lib/mongo/*`.
- **Public reads** (creator profile, answered questions) are Route Handlers under `src/app/api/` consumed via `fetch` from client pages.
- **Admin reads** (pending questions, moderation) use Server Actions invoked directly from Server Components.
- **Database access** goes exclusively through the Prisma singleton (`src/server/db/PrismaClientSingleton.ts`); never instantiate a second `PrismaClient`.
- **Imports** always use the `@/` alias (`@/*` → `./src/*`). No relative imports across feature boundaries.
- **Moderation pipeline**: user submits → admin approves (`isApproved`) → creator answers (`isAnswered`) → public answers page.

## Design Principles

### Data & Validation
1. **Validate everything at the boundary.** Every Server Action accepts `unknown` and passes data through a Zod schema (`QuestionSchema`, `AnswerSchema`) with `safeParse`. Never trust raw `FormData`.
2. **Return `{ error: string }` unions, never throw.** Mutations wrap Prisma calls in `try/catch` and return an error object. Client code checks `response?.error`.
3. **Log errors server-side** with `console.log("...", error)`, surface the short message to the user via toast.

### State & Data Fetching
4. **Server Components read; client components ask.** Use the server session hook (`useServerSession`) in Server Components; use `useClientSession` only where client state is required.
5. **Use `useTransition` + `useFormStatus`** for pending UI on forms and navigation; never gate UI on manual booleans when these exist.
6. **Revalidate after mutation** with `revalidatePath("/dashboard")` (or the affected route) so Server Components refetch fresh data.
7. **Skeletons over spinners.** Every interactive page/view that loads asynchronously has a matching component under `src/components/skeletons/`.
8. **Keep derived logic in `src/lib/`.** Pure helpers (`filterUsers`, `getUpdatedFields`, `getLastSuccessfullQuestionsTimeStamp`) live in `src/lib/helpers.ts`; shared types and Zod schemas live in `src/lib/types.ts`. `src/lib/mongo/*` holds Prisma query wrappers only.

### Security & Limits
9. **Rate limit spam surfaces.** Submissions are limited to 2 questions per creator per hour. `createQuestion` counts `Question` rows in the last 60 minutes matching the hashed `submitterKey` (recipientId + client IP) and rejects when the count is `>= ALLOWED_REQUESTS`. Keep the constants in `src/config/rateLimit.ts`.
10. **Hash identifying payloads** (`createHash("sha256")`); never store raw IPs.
11. **Authorization is server-side.** `redirect()` in Server Components when unauthenticated or when a non-admin hits `/dashboard/admin`; admin role comes from `process.env.ADMIN_EMAIL` on the JWT.
12. **Signed-in session only reaches own data**; `getAllQuestionsByUser` scopes by the session email and only returns `isApproved: true` questions.

### UI & Design System
13. **Dark-first design tokens.** Use the CSS variables in `src/app/globals.css`; the Tailwind-equivalent literals used across the app are:
    - ink `#0a0b0d`, panel `#111318`, panel-raised `#171a21`, line `#292d36`, muted `#858b98`, text `#f4f3ef`, accent/lime `#d8f36b`, accent-ink `#171b0a`.
14. **Reuse the established surface language**: `rounded-2xl border border-[#292d36] bg-[#111318]` cards, `tracking-[-0.03em]`/`tracking-[0.16em]` typography, uppercase micro-labels in the accent or muted color, `hover:border-[#d8f36b66]` links.
15. **Prefer tokens over new colors.** New shades must come from the existing palette; do not introduce ad-hoc colors outside `globals.css` variables and the agreed literals.

### Code Style
16. **TypeScript strict everywhere.** Prefer `z.infer` for payload types over hand-written duplicates.
17. **Export a single default per component file**, PascalCased filename matching the component (e.g. `UserForm.tsx`).
18. **Barrel files for shared modules.** Re-export from `src/components/index.ts` and `src/hooks/index.ts`; import shared components/hooks from the barrel.
19. **`"use client"` marks interactive components** (state, effects, event handlers, hooks); keep Server Components free of client-only imports.
20. **No comments unless they explain a non-obvious decision.** Code should be self-documenting.

### Git & Pull Requests
21. **Never raise a pull request on your own.** Before creating or pushing to a branch, opening a PR, or updating an existing PR, ask the user for explicit permission. Work stays uncommitted or local until the user approves the action.

## Definition of Done

A change is only complete when it is:
- consistent with the architecture and design principles above,
- validated inputs/mutations against their Zod schema,
- rated against `npm run lint` with no new errors,
- type-checking and build-clean (`npm run build`),
- styled within the existing design system (tokens/utilities only).