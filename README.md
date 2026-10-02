# Artinazma portfolio

A bilingual portfolio for Vahid Arbaa's web dashboard services, with three interactive demonstrations for laboratories and chemical-industry businesses. Persian (`/fa`, RTL) is the default; English (`/en`, LTR) is available on every page. `/` redirects to `/fa`.

## Pages

All demo paths below are prefixed with `/fa` or `/en`.

| Path                           | Contents                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| `/`                            | Services, three demos, delivery process, contact details and downloadable project brief         |
| `/demo/laboratory`             | Laboratory overview                                                                             |
| `/demo/laboratory/samples`     | Searchable sample register and custody pipeline                                                 |
| `/demo/laboratory/instruments` | Status, calibration and utilisation                                                             |
| `/demo/laboratory/qc`          | Control charts and quality-control rules                                                        |
| `/demo/laboratory/turnaround`  | Turnaround against targets                                                                      |
| `/demo/sales`                  | Monthly revenue, margin, customer concentration, invoices, receivables and opportunity pipeline |
| `/demo/inventory`              | Production plan, batch yield, downtime, material cover and replenishment risks                  |

Sales and inventory tables support filtering and CSV export. The contact form downloads a plain-text brief for the visitor to email; it does not send or store submissions. Email and phone links use the contact details supplied by the owner.

## Run and verify

Use Node.js 22.6 or newer (Node 24 recommended for the native TypeScript test runner).

```sh
npm install
npm run dev
```

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

`next/font/google` fetches Inter and Vazirmatn during the build, so Google Fonts must be reachable at build time. The resulting fonts are served locally. No API keys or environment variables are needed. The pages are prerendered; the default configuration runs on Next.js hosting such as Vercel, not a plain static file server.

## Data and calculation boundaries

- All demo companies, people and records are fictional. There are no connections to company APIs, spreadsheets or databases.
- Laboratory records live in `src/lib/demo/laboratory.ts`, with derived measures in `src/lib/demo/selectors.ts`.
- The management demo keeps its seed records in English in `src/lib/demo/management.ts`, because those strings are the keys that filters, the digest, the persisted browser state and the tests all run on. `src/lib/demo/management-i18n.ts` maps them to the reader's script at render time, and leaves any text the visitor has typed themselves unchanged in both languages.
- Sales and manufacturing records and their shared calculations live in `src/lib/demo/business.ts`.
- The snapshot date is fixed at 24 September 2026. Sales periods are explicitly Gregorian months in both languages; individual Persian dates use the Persian calendar.
- Invoice month changes sales KPIs and the invoice register. Search and status apply only to the register and its CSV export. The trend shows all three months; the opportunity pipeline is an independent snapshot.
- Overdue amounts include only unpaid balances with due dates before the snapshot. Gross margin is calculated from total revenue and total cost, not an average of invoice margins.
- Production-line selection scopes output, yield, downtime and batches. Warehouse stock is shared across all lines. Material search and risk filtering scope the stock table and CSV.
- Available material = on-hand stock minus reservations. Coverage = available stock divided by average daily use. Incoming stock is excluded because arrival dates are not confirmed.
- Yield uses completed batches only. QC-held output is shown separately from released output.

## Interface

Charts are SVG components with keyboard readouts and table equivalents. Numeric bars also expose their values in text. Themes follow the OS preference, with a manual toggle saved locally. Tables scroll within their containers on narrow screens.

## Checks

`tests/business.test.mjs` covers partial payments, due-date boundaries, financial reconciliation, material availability, weighted batch yield, Gregorian invoice labels and CSV encoding/escaping. Browser verification is performed against the production build in both languages.

## Remaining delivery work

The website and demos are implemented locally. Public Vercel deployment, the separate one-page sales handout and recorded demo videos are not included in the current deliverable. See `BRIEF.md` for business context.
