# Maqolas Frontend

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Redux Toolkit / RTK Query + shadcn/ui — SEO-first setup.

## Stack

| Texnologiya | Versiya / izoh |
|-------------|----------------|
| Next.js | 16, App Router, Turbopack (`dev`) |
| TypeScript | strict |
| Tailwind CSS | v4 |
| Redux Toolkit + RTK Query | `src/lib/store`, `baseApi` |
| shadcn/ui | Radix Nova (`radix-nova`), preset `b3gmgq` |
| SEO | Metadata API, `sitemap`, `robots`, `manifest`, JSON-LD |

## Boshlash

```bash
cd maqolas-frontend
copy .env.example .env.local
npm install
npm run dev
```

> **Eslatma:** `npm install` ni faqat `maqolas-frontend` ichida ishga tushiring (parent `Maqolas` papkasida emas).

### shadcn/ui (preset bilan o‘rnatilgan)

```bash
pnpm dlx shadcn@latest init --preset b3gmgq --template next -y -f --no-reinstall
```

Yangi komponent qo‘shish:

```bash
pnpm dlx shadcn@latest add card input dialog
# yoki: npm run shadcn -- add card
```

**Preset:** `b3gmgq` — Radix Nova, neutral base, pink theme, Inter font.

[http://localhost:3000](http://localhost:3000)

## Muhit o‘zgaruvchilari

| O‘zgaruvchi | Ma’nosi |
|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Sayt URL (canonical, OG, sitemap) |
| `NEXT_PUBLIC_API_URL` | Backend API (RTK Query `baseUrl`) |

Validatsiya: `src/config/env.ts` (Zod).

## Papka tuzilmasi

```
src/
├── app/              # App Router, SEO routes (sitemap, robots, manifest)
├── components/
│   ├── providers/    # Redux StoreProvider
│   ├── seo/          # JSON-LD
│   └── ui/           # shadcn komponentlar
├── config/           # site.ts, env.ts
├── features/         # feature-based API (masalan articles)
└── lib/
    ├── seo/          # buildPageMetadata, json-ld
    └── store/        # Redux + RTK Query
```

## SEO

- **Global metadata:** `src/lib/seo/metadata.ts` → `buildPageMetadata()`
- **Sahifa:** `export const metadata = buildPageMetadata({ title, path, ... })`
- **JSON-LD:** `JsonLdScript` + `buildOrganizationJsonLd` / `buildWebSiteJsonLd`
- **Fayllar:** `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/icon.tsx`, `app/apple-icon.tsx`

Production uchun `.env` da `NEXT_PUBLIC_APP_URL=https://maqolas.tm2.uz` qo‘ying.

## shadcn/ui

Yangi komponent:

```bash
npx shadcn@latest add card input
```

## RTK Query

Yangi endpoint — `baseApi.injectEndpoints` (namuna: `src/features/articles/api/articles-api.ts`).

Store ga feature import qiling (`src/lib/store/index.ts` dagi kabi).

## Skriptlar

- `npm run dev` — development (Turbopack)
- `npm run build` — production build
- `npm run typecheck` — TypeScript
- `npm run lint` — ESLint
