# LendLoop (front-end)
Next.js App Router + Tailwind v4. Run: `npm install && npm run dev` (placeholder images in `public/img`, replace freely).

- `src/app/page.tsx`: public page (name + category only).
- `src/app/(app)/*`: signed-in screens (Browse, My listings, My requests, Incoming, Admin).
- `src/components`: UI kit, nav, forms, loan list. No business rules.
- `src/lib/store.tsx`: data layer on mock data. Screens only call `useApp()`, `useTools()`, `useLoans()`.
  Back-end day: swap the internals for Convex queries/mutations; screens stay unchanged.
- "View as" switch in the nav is a demo-only role toggle (real roles come from Convex).
