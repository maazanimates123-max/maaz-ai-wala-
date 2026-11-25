# Maaz AI Wala — AI Automation Agency Platform

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Postgres, Auth, Storage, RLS) · Framer Motion · n8n.

Marketing website + interactive demos + consultation booking + client portal + admin system.

## What's included

**Website** — Home (hero with animated workflow visual, count-up stats, services, featured projects, integrations, verified-only testimonials, YouTube, CTAs), 15 service detail pages (`/services/[slug]`: problem, how it works diagram, benefits, use cases, integrations, FAQs + FAQ schema, Get a Quote, Book Consultation, share buttons), 10 industry pages (`/solutions/[slug]`), interactive demos (`/demos`: workflow execution simulator, input/output, sample AI output, before/after), portfolio with category filters + case study pages, pricing (Starter $299, Professional $1,000, Custom) with comparison table, limits, support and additional costs, About, How It Works, Contact, Privacy, Terms.

**UX** — purple/cyan premium dark theme + light mode toggle (saved per visitor, no flash), sticky nav with Services/Solutions dropdowns, mobile accordion menu, page transitions, scroll reveal, loading screens, reduced-motion support, accessible dialogs and focus states.

**AI assistant** — floating chatbot → `/api/chat` server proxy → `N8N_CHAT_WEBHOOK_URL`. Sends the last 10 messages as `history`, quick actions (book, pricing, talk to a human/WhatsApp), conversation logging, error + retry states. If n8n returns `{"reply": "...", "lead": {"name","email","service","budget","notes"}}` the lead is saved automatically.

**Booking** — `/book`: service, date, live time slots (PKT business hours, shown in the visitor's timezone), details, requirements. Double booking is blocked by a database unique index. Confirmation email with `.ics` invite + Google Calendar link, owner notification, secure manage link (`/book/manage/[token]`) for reschedule/cancel, daily reminder cron (`/api/cron/reminders`), optional Google Calendar sync via service account.

**Leads** — project form (public), contact form (budget, phone, service), WhatsApp button, chatbot leads, bookings. Saved to DB, owner notified, customer confirmation email (when email provider is configured), honeypot + timing + rate-limit spam protection.

**Client portal** (`/dashboard`, Google or email-link sign-in) — overview, projects (timeline, progress, deployment status), purchased services, quotations (accept/decline), invoices & payment history, online payment (when a gateway is configured) or manual reference submission, documents & reports downloads (private storage, signed URLs), consultations, support tickets, notifications, account settings (sign out everywhere).

**Admin** (`/admin`) — role-based (owner = `ADMIN_EMAIL`, manager, support), overview with customers/projects/leads stats + revenue analytics from verified payments, leads, bookings, projects (status, progress, deployment, notes, quotations, payment verification, document uploads, resend to n8n), invoices & payments, contact inbox, support tickets, customers (restrict/restore), services, portfolio, testimonials (verified-only publishing), pricing, website content (hero, CTA, about, contact, social incl. LinkedIn, footer, booking hours, YouTube video, payment instructions), chatbot settings + conversation logs, integrations status + webhook test buttons, team & roles, activity log, CSV exports.

**Platform** — SEO (unique metadata, OG image, sitemap with all service/industry/case-study pages, robots, JSON-LD: ProfessionalService, Service, FAQPage), GA4 (optional), server + client error monitoring (logs + optional webhook), security headers, RLS on every table, server-side validation, same-origin checks, rate limiting.

## Honesty rules built in
- No fake testimonials: only rows marked *verified* by the owner can be published.
- Stats are factual counts (services, industries, integrations), not invented client metrics.
- Demo portfolio items and demo simulations are clearly labelled.
- Payments are only marked paid after admin verification or a signed gateway webhook.
- Integrations (email, calendar, payments, analytics) stay off until real credentials are set.

## Setup
1. `npm install`
2. Supabase → SQL editor: run `supabase/migrations/20261121000001_init.sql`, then `supabase/migrations/20261121000002_platform.sql`.
   Optional checks: `supabase/tests/rls_smoke_test.sql` and `supabase/tests/rls_platform_test.sql` (both roll back).
3. Supabase → Authentication → URL configuration: Site URL = your domain; Redirect URLs: `https://your-domain.com/auth/callback`, `http://localhost:3000/auth/callback`.
   Providers → Google: add your Google OAuth client ID/secret (Google Cloud redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`).
4. Copy `.env.example` → `.env.local` and fill in values.
5. `npm run dev` → http://localhost:3000. Sign in with `ADMIN_EMAIL` → `/admin` → click **Import defaults** on Services, Portfolio and Pricing so they become editable.
6. Admin → Website content: set WhatsApp number, booking hours, meeting link, LinkedIn, YouTube video.

## n8n contract
- Chat request: `{ message, sessionId, source, page, history: [{role, content}] }` → respond `{ "reply": "..." }` (optionally `"lead": {...}`).
- Intake request: `{ event: "project.submitted", project: {...}, name, email, service, budget, timeline }` → optionally `{ "lead_status": "hot|warm|cold", "score": 0-100, "reason": "..." }`.
- Production `/webhook/` URLs only work while the workflow is **Active**. `N8N_WEBHOOK_SECRET` is sent as `X-Webhook-Secret`.

## Deploy (Vercel)
Import the repo → add env vars from `.env.example` (include `CRON_SECRET`) → deploy → set Supabase Site URL / Redirect URLs to the live domain. `vercel.json` schedules the daily reminder job. File uploads are limited to 4 MB (Vercel request limit).

## Scripts
`npm run dev` · `npm run build` · `npm start` · `npm run lint` · `npm run typecheck`
