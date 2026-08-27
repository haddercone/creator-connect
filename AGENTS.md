# AGENTS — Instructions for AI coding agents

Agent instruction file for **Creator Connect Q&A platform**. Follow these conventions for every task. The authoritative engineering spec — tech stack, architecture, and design principles — lives in **`CONTROLS.md`**; read it first when you need details or when in doubt.

## Project at a glance

Creator Connect lets fans ask questions to creators. Questions are moderated by an admin, answered by creators, and shown publicly on a creator's page.

- **Stack**: Next.js 16 (App Router + Turbopack), React 18, TypeScript (strict), Tailwind CSS, Prisma + MongoDB, Next-Auth (GitHub/Twitter), Zod, Upstash Ratelimit + Vercel KV, Recoil, react-hot-toast.
- **Auth**: Next-Auth. `ADMIN_EMAIL` gates the admin role on the JWT; `/dashboard/admin` redirects non-admins to `/dashboard`.
- **Storage**: Prisma schema in `prisma/schema.prisma` (MongoDB, `@db.ObjectId` on `@id auto()`). The `Question` model uses `isApproved` / `isAnswered` / `isDeleted` flags to drive the moderation → answer → public pipeline.

## Commands

```bash
npm run dev      # dev server
npm run build    # prisma generate && next build  (verification)
npm run lint     # eslint .                       (verification)
npm run start    # production server
```

Run `npm run lint` and `npm run build` after making changes. The build also regenerates the Prisma client.

## Rules of the road

1. **Structure**: keep code in App Router folders under `src/` — pages/actions in `src/app/`, UI in `src/components/`, hooks in `src/hooks/`, data helpers in `src/lib/mongo/`, Prisma client in `src/server/db/`.
2. **Imports**: always `@/`-alias from `src/`. Import shared components/hooks from the barrel files `src/components/index.ts` and `src/hooks/index.ts`.
3. **Mutations** are Server Actions (`"use server"`). Accept `unknown`, validate with the shared Zod schemas in `src/lib/types.ts` (`QuestionSchema`, `AnswerSchema`) using `safeParse`, then `revalidatePath(...)` after a successful write.
4. **Reads**: Server Components query Prisma directly. Client pages `fetch` public Route Handlers (`/api/creator-details`, `/api/answered-questions`). Do not open a second PrismaClient — use the singleton in `src/server/db/PrismaClientSingleton.ts`.
5. **Errors**: return `{ error: string }` from actions, never throw to the UI. Show the message with `toast.error(...)`; log the real error server-side with `console.log`.
6. **UI**: reuse the existing design system — panels `bg-[#111318]` with `border-[#292d36]`, text `#f4f3ef` / muted `#858b98`, lime accent `#d8f36b`, rounded-2xl cards, tracking-tight headings. Do not introduce new colors or a component library.
7. **Forms**: use `useFormStatus` for submit pending state and `useTransition` for navigation-held pending; keep loading states as skeleton components in `src/components/skeletons/`.
8. **Security**: don't log or store raw client IPs (hash them); keep rate-limit constants in `src/config/rateLimit.ts`; everything requiring auth/authorization must be enforced server-side with `redirect()`.
9. **Style**: strict TypeScript, one default export per component file, PascalCase filenames, no comments unless a decision is non-obvious. Match the surrounding code's style exactly.
10. **Do NOT**: add dependencies, change auth/rate-limiting semantics, or refactor shared patterns (Prisma access, barrels, validation approach) without flagging it — existing patterns are deliberate.

## Workflow for making changes

1. Explore the relevant area first (schema, types, existing actions/components) to match conventions.
2. Implement using the established patterns from §Rules of the road and `CONTROLS.md`.
3. Verify: `npm run lint` then `npm run build`.
4. On conflict between AGENTS.md and CONTROLS.md, `CONTROLS.md` wins.