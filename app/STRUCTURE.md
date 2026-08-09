# Project layout

Next.js App Router lives under `app/`. Shared code uses path aliases (see `tsconfig.json`).

| Path | Purpose |
|------|---------|
| `app/[locale]/` | Localized routes (`(public)` auth pages, `(protected)` app shell) |
| `app/components/` | UI by feature: `chat/`, `case/`, `sidebar/`, `global/` |
| `app/hooks/` | Client hooks by domain (`auth/`, `case/`, `chat/`, …) |
| `app/providers/` | React context and layout providers (not hooks) |
| `app/types/` | Shared TypeScript types |
| `app/lib/` | Supabase, API helpers, server utilities |
| `lib/utils.ts` | `cn()` helper for Tailwind (shadcn) |
| `messages/` | next-intl locale JSON |
| `i18n.ts`, `i18n/request.ts` | Locale routing config |

Import convention: `@/components/...`, `@/hooks/...`, `@/lib/...`, `@/providers/...`, `@/types/...`.
