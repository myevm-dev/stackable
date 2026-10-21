# stackable.work

Landing page for Stackable — the work marketplace for people and agents.

- **Next.js 16** (App Router) + Tailwind v4
- **Motion** (Framer Motion) for entrance, scroll-linked and layout animations
- **Animated 3×3×3 block hero** (`components/cube-hero.tsx` + `cube-hero.scss`), recolored to the logo palette with mouse-parallax tilt
- Canvas starfield with comets (`components/starfield.tsx`)
- Respects `prefers-reduced-motion`

## Run

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build && pnpm start
```

Deploys to Vercel as-is (Vercel Analytics is wired in for production).
