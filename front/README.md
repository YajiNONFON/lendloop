# LendLoop front-end

Next.js (App Router), TypeScript, Tailwind. Run: `npm install && npm run dev` (needs `.env.local`, see `.env.example`).

- `src/app/page.tsx`: public landing page (tool names and categories only).
- `src/app/(app)/*`: signed-in screens: Dashboard, Tools, My listings, My requests, Incoming, Admin.
- `src/components`: UI kit, navigation, tool and loan components, forms. No business rules here.
- Data: every screen reads and writes through Convex (`@convex/_generated/api`). The access rules live in `back/convex`, the screens only display what the server allows.
- Images in `public/img` are placeholders, replace them freely.
