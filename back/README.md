# LendLoop back-end (Convex)
Modular monolith inside `convex/`. Each module: `domain.ts` (pure rules), `queries.ts` / `mutations.ts` (thin Convex functions), tests in `tests/<module>/`.

- `convex/shared`: auth guards (`requireUser`, `requireAdmin`), errors, HMAC signing.
- `convex/users`: profile creation, roles (decided on the server), Trusted Lender.
- Tests: `npm test`. Types: `npm run typecheck`. Dev server: `npm run dev`.
- Secrets: see `.env.example` (set on the Convex deployment, never committed).
