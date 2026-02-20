# March Madness Moments (2026)

Single-page React + TypeScript campaign site for Genius Sports' March Madness moments concept.  
The app is built with Vite, styled with Tailwind CSS and theme tokens, and organized around one central content file.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router (`BrowserRouter`)
- Tailwind CSS
- Framer Motion

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (typically `http://localhost:5173`).

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Type-check and build for production
- `npm run preview` - Preview the production build locally

## Routing

Routes are defined in `src/App.tsx`:

- `/` -> `MarchMadnessMomentsPage`
- `/march-madness-moments` -> `MarchMadnessMomentsPage`
- `*` -> redirect to `/`

## Page Structure

`src/pages/MarchMadnessMomentsPage.tsx` renders the campaign flow in this order:

1. `HeroSection`
2. `SectionNav` (sticky in-page nav)
3. `FanCloudComparisonSection`
4. Campaign intro block
5. `ProofBand`
6. `HowItWorksSection`
7. `MomentsSection`
8. `AudiencesSection`
9. `CreativeChannelSection`

## Content-Driven Architecture

Primary content source: `src/content/marchMadnessMoments.ts`

This file contains the typed content model and all section copy/data, including:

- Hero stats
- Fan cloud comparison text and metrics
- Proof copy and chart data
- How-it-works steps
- Moment labels and modal template bullets
- Audience lists
- Creative/channel visualization content
- CTA copy values

Most messaging updates can be made in this file without changing component logic.

## Important Directories

```text
src/
  components/
    motion/
    nav/
    sections/
    ui/
    visualizations/
  content/
    marchMadnessMoments.ts
  pages/
    MarchMadnessMomentsPage.tsx
  App.tsx
  main.tsx
  index.css
  styles/theme.css
```

## Styling and Motion

- `tailwind.config.ts` maps design tokens into the Tailwind theme
- `src/styles/theme.css` defines token-level styling variables
- `src/index.css` contains global and shared utility styles
- Motion behavior lives in `src/components/motion/` and is used across sections and nav interactions

## Notes for Maintenance

- Update campaign copy/data in `src/content/marchMadnessMoments.ts`
- Update section-specific UI in `src/components/sections/`
- Update reusable modal or rails in `src/components/ui/`
- Keep section IDs and `SectionNav` item IDs in sync for smooth in-page navigation
