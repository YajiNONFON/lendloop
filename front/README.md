# LendLoop front-end

Next.js (App Router), TypeScript, Tailwind. Run: `npm install && npm run dev` (needs `.env.local`, see `.env.example`).

- `src/app/page.tsx`: public landing page (tool names and categories only).
- `src/app/(app)/*`: signed-in screens: Dashboard, Tools, My listings, My requests, Incoming, Admin.
- `src/components`: UI kit, navigation, tool and loan components, forms. No business rules here.
- Data: every screen reads and writes through Convex (`@convex/_generated/api`). The access rules live in `back/convex`, the screens only display what the server allows.
- Images live in `public/images` (`hero.png`, `how-list.png`, `how-request.png`, `how-return.png`, `cta-banner.png`, `tool-default.png`). Every tool shows `tool-default.png` through one component, `src/components/tool-image.tsx`, so real photos can be plugged in later without touching any screen.
- Layout: fixed sidebar on desktop, drawer on mobile and tablet (`src/components/app-shell.tsx`). Icons are `lucide-react`, animations use Framer Motion and respect reduced motion.
