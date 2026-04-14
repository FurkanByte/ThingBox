<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:thingbox-project-rules -->
# ThingBox Project Rules

## Stack
- Next.js App Router (latest), React 19, Prisma ORM, SQLite, TypeScript
- Auth: JWT via `jose`, password hashing via `bcryptjs`
- No Tailwind — all styles use custom CSS variables in `src/app/globals.css`

## Database / Prisma — CRITICAL
- **NEVER use `prisma db push`** — it can silently destroy data on schema changes.
- **Always use `prisma migrate dev --name "<description>"`** for any schema change.
- Migration files live in `prisma/migrations/` and must be committed to git.
- To check sync status: `npm run db:status`
- To open visual DB explorer: `npm run db:studio`
- A baseline migration (`0001_init`) already exists. All future changes must layer on top via `migrate dev`.

## Authentication & Permissions
- Session is stored in an `httpOnly` cookie as a JWT, managed in `src/lib/auth.ts`.
- `getSession()` is async — always `await` it in Server Components and API routes.
- `cookies()` from `next/headers` is async in this Next.js version — always `await cookies()`.
- Global session context for client components: `src/context/SessionContext.tsx` → use `useSession()`.
- Root layout wraps the entire app in `<SessionProvider session={session}>`.
- Permission fields on User model: `isAdmin`, `canViewInventory`, `canManageSystem`, `canAddStock`, `canDrawToProject`, `canConsume`.
- Admin auto-seed: first login attempt with `admin / admin123` creates the admin account if no users exist.

## Permission Enforcement — Must Always Do Both
1. **Server side:** All Server Actions and API route handlers must call `getSession()` and throw/return 403 if the user lacks the required permission.
2. **Client side:** UI buttons/forms must check `useSession()` and be hidden (not just disabled) for unauthorized users.
- `canManageSystem` → guards: create/edit/delete for Materials, Fixtures, Locations, Categories, Projects.
- `canAddStock` → guards: Add Stock forms and `addStock` action.
- `canDrawToProject` → guards: Use Material / return to depot actions.
- `canConsume` → guards: Consume (archive) material action.

## Key File Locations
- `src/lib/auth.ts` — JWT encrypt/decrypt, getSession, createSession, clearSession
- `src/middleware.ts` — Edge middleware protecting all routes except `/login`
- `src/context/SessionContext.tsx` — React context for client-side permission checks
- `src/app/admin/users/` — Admin user management panel (create users, set permissions, reset passwords)
- `src/app/login/` — Login page and logout server action
- `prisma/schema.prisma` — Single source of truth for all data models
<!-- END:thingbox-project-rules -->

