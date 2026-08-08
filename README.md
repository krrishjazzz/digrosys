# Digrosys — Premium Landing Page

Award-caliber landing site for Digrosys: commercial production & performance marketing.

## Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion · GSAP · Lenis
- Three.js / React Three Fiber
- Shadcn-style UI primitives
- Lucide Icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

This project is ready to deploy on Vercel.

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Vercel will detect the Next.js app automatically.
4. Deploy.

If you want to connect it manually, use:

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

## Scripts

| Command       | Description              |
| ------------- | ------------------------ |
| `npm run dev` | Local development server |
| `npm run build` | Production build       |
| `npm run start` | Start production server |
| `npm run lint` | ESLint                   |

## Project Structure

```
src/
  app/                 # App Router entry, layout, global styles
  components/
    layout/            # Navbar, Footer, Lenis, cursor, loader, grain
    sections/          # All 14 landing sections
    three/             # R3F hero scene
    shared/            # TextReveal, Marquee, counters
    ui/                # Button, Accordion, form controls
  data/                # CMS-ready JSON (portfolio, services, etc.)
  hooks/               # Mouse / magnetic helpers
  lib/                 # Utils + GSAP registration
```

## CMS-ready Data

Replace JSON under `src/data/` with Sanity / Supabase fetches later:

- `portfolio.json`
- `testimonials.json`
- `services.json`
- `clients.json`
- `faqs.json`
- `process.json`

## Design System

- Surface `#FFFFFF`
- Mist `#F6F6F4`
- Type `#111111`
- Gold `#B8922A`
- Headings: General Sans (Fontshare)
- Body: Inter

## Cloudinary media uploads

1. Add Cloudinary keys to `.env.local` (see `.env.example`)
2. Set `ADMIN_PASSWORD`
3. Open [http://localhost:3000/admin/media](http://localhost:3000/admin/media)
4. Login → **Upload photos / videos**
5. Assets land in folder `digrosys/portfolio` and appear on the homepage Portfolio

**Security:** Never commit `CLOUDINARY_API_SECRET`. Rotate it if it was shared publicly.

## Lead tracker

Password-protected dashboard for enquiries:

- [http://localhost:3000/admin/leads](http://localhost:3000/admin/leads)
- Tabs: **Website enquiries** · **Connect card** · **Other leads**
- Same `ADMIN_PASSWORD` as media admin
- Website contact form saves here automatically (`data/leads.json`)

