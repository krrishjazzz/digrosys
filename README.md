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

## Enquiry form routing

Homepage contact form posts to `/api/enquiry` and fans out to:

1. **Email** → `digrosys@gmail.com` (FormSubmit by default; Resend / Web3Forms optional)
2. **WhatsApp** → opens chat to `8910481382` with the enquiry prefilled
3. **Google Sheet** → optional webhook (`GOOGLE_SHEETS_WEBHOOK_URL`)

See `.env.example` and `scripts/google-sheets-enquiry.gs`.

**First FormSubmit use:** check digrosys@gmail.com for an activation email and click confirm.
