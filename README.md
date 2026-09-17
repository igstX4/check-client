# Check Platform — client

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?logo=redux&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white)

Front end of a payment-application platform: one React app that serves **two
audiences** — an operations back office for staff and a lightweight portal where
a client tracks their own applications using a personal link.

## What it does

| Area | Capability |
|------|------------|
| **Applications** | Full pipeline of a payment request with four states — *Создана → В работе → Оплачено клиентом → Оплачено нами* — plus filters by date, sum, company, seller and type. |
| **Checks** | Register and review checks, export the current selection to Excel (`xlsx` + `file-saver`). |
| **Clients & companies** | Directories with detail pages, editable profiles, related applications and checks. |
| **Sellers** | Seller directory with its own tables, filters and creation flow. |
| **Comments & history** | Per-application discussion and an audit trail of every status change. |
| **Access control** | Role-aware routing: admin panel, super-admin-only sections (`/admin/settings/access`) and a key-based client portal. |
| **Mobile-first UX** | Bottom sheets, sticky bars and an installable PWA build for phones. |

## Two front doors

```
/admin/login              → staff sign-in
/admin/*                  → back office (panel layout)
   /admin/settings/access → super-admin only (route guard)

/client/login/:key        → personal link sign-in (no password)
/client                   → client portal (protected route)
```

Route guards live in `src/components/protected-route`,
`protected-super-admin` and `protected-client-route`, so authorisation is
decided before a page renders rather than inside each page.

## Project structure

```
src/
├── api/            axios instances: `clientApi` and `adminApi`
├── app/            app entry, providers and the router definition
├── assets/         icons and illustrations
├── components/
│   ├── ui/         in-house design system (~30 pieces: buttons, modals, popups,
│   │               pagination, selects, status badge, date & sum filters…)
│   ├── modals/     ~20 dialogs and mobile bottom sheets
│   ├── tables/     access, active, checks, client checks, history, sellers
│   └── …
├── constants/      application statuses (labels, colours, order)
├── contexts/       notification context
├── hooks/          typed redux hooks, useDebounce
├── layouts/        panel layout (admin) and client layout
├── pages/          one folder per screen, SCSS module next to the component
├── store/          Redux Toolkit store with 9 slices
└── styles/         shared styles
```

**State split.** Redux Toolkit owns cross-cutting client state (filters,
selection, auth, comments, history); TanStack Query owns server state
(caching, refetching and loading flags), which keeps the slices free of
request lifecycle bookkeeping.

**Slices:** `admin`, `client`, `seller`, `application`, `selectors`, `check`,
`company`, `comment`, `history`.

## Tech stack

React 18 · TypeScript 5.6 · Vite 5 · Redux Toolkit · TanStack Query ·
React Router 6 · axios · SCSS modules · react-select · react-date-range ·
xlsx / file-saver · react-icons · vite-plugin-pwa · ESLint 9 (flat config).

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

### Pointing the app at a local API

The API base URL lives at the top of `src/api/axios.ts`:

```ts
const API_URL = 'https://checkplatform.ru/api';
// const API_URL = 'http://localhost:4000/api';
```

Swap that constant (or move it to `import.meta.env.VITE_API_URL`) to run the
client against a local backend. Both axios instances read their bearer token
from `localStorage` (`token` for the admin panel, `client` for the portal).

## Deployment

Built as a static bundle and hosted on Vercel; `vercel.json` rewrites every path
to `/` so client-side routing works on deep links such as
`/client/login/:key`. The PWA plugin adds a web app manifest
(`display: standalone`, `start_url: /admin/login`), so the back office can be
installed on a phone.

## Notes for the next iteration

- The UI copy is Russian; strings are inline rather than routed through an i18n
  layer, which is the first thing to extract if a second language is needed.
- `API_URL` is currently committed as a constant — moving it to a Vite env
  variable would make preview deployments point at their own backend.
