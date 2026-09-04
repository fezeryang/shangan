# Shang'an Assessment (shangan)

## Overview

Job-assessment practice platform: real-question practice across three subjects — verbal comprehension / data analysis / figure reasoning — plus timed mock exams, a mistake notebook, a learning-analytics dashboard, and AI-driven per-question explanations with variant questions. React SPA + Express AI proxy; no account system — all user data is stored in localStorage.

## Tech Stack

- TypeScript ES2022 (bundler resolution, no eslint/prettier), React 19, Vite 6, Tailwind 4
- Server: Express 4; in dev it is mounted through Vite middleware (same port); esbuild bundles `server.ts` → `dist/server.cjs`
- AI: `@google/genai` (native Gemini) + OpenAI-compatible protocol + Anthropic protocol (minimax/anthropic), switched via environment variables
- UI: drawably scrapbook-style component library, d3, recharts, motion, react-markdown; runs on Node (tsx in development)

## Layout

- `server.ts` — all `/api/ai/*` routes and the multi-provider abstraction; static asset serving
- `prompts.ts` — all AI prompts and the `PROMPT_TASKS` registry (versioned by `PROMPTS_VERSION`)
- `jsonLoose.ts` / `svgSanitize.ts` — hardening of AI output (lenient JSON parsing, SVG sanitization)
- `src/figureEngine/` — figure-reasoning engine: `spec.ts` (rule definition/validation) → `generators.ts` (local SVG rendering) → `verify.ts` (independent re-derivation check)
- `src/data/` — large question banks (verbal/dataAnalysis/graphicQuestions at 200–450KB each), knowledgeTaxonomy, formulaBank, analytics
- `src/components/` — UI; `App.tsx` is the shell (tab switching, no router); `components/lab/` is the figure lab
- `scripts/` — check-* assertion tests and question-bank maintenance scripts; `docs/` — design and plan documents
- Parent `../2026上岸测评题库.pdf` — original source of the question bank (PDF, read-only reference)

## Commands (all run inside shangan/)

- `npm run dev` — runs server.ts with tsx (Express + Vite middleware)
- `npm run build` — vite build + esbuild for the server → `dist/server.cjs`
- `npm start` — runs dist/server.cjs in production; `npm run preview` — frontend preview only
- `npm test` — four assertion scripts: check-prompts / check-figure-engine / check-json-loose / check-analytics
- `npm run lint` — `tsc --noEmit` (the only static check)
- `npm run clean-explanations` / `npm run enrich-figures` — question-bank data maintenance

## Architecture (non-obvious constraints)

- AI trust boundary: the browser never holds any API key; every AI call is proxied through server.ts `/api/ai/*` (explain / graphic-pattern / generate-variant / diagnose / chat).
- All AI output is untrusted: JSON goes through `parseJsonLoose` (fenced/prose-wrapped/broken-output repair), SVG goes through `sanitizeSvg`, and figure variants are cross-validated because `verify.ts` independently re-derives the answer against generators.
- `prompts.ts` is the single source of truth for prompts: new tasks must first register in `PROMPT_TASKS` (system + generation params); inlining prompts inside server.ts is forbidden; question context goes into the first user message, not system (see docs/prompt-engineering-review.md C-1).
- Persistence: localStorage only, keys versioned (`shangan_*_vN`); older keys are read-only migration sources; the migration map is centralized at the top of App.tsx.
- In `vite.config.ts`, `DISABLE_HMR` prevents flicker during agent edits — do not touch that section.

## Conventions

- Language: UI copy, prompts, comments, and docs are all in Chinese.
- UI must use drawably/react components (DrawablyButton/Input/Select/Textarea) and the DESIGN.md scrapbook tokens; default `outline`, current selection `scribble`, single primary action `solid`; `tone="danger"` only for irreversible actions.
- Tests are framework-less assert scripts under scripts/, run via `npm test`; after changing prompts, run `UPDATE_PROMPT_SNAPSHOT=1 npm test` to regenerate snapshots and bump `PROMPTS_VERSION`.
- Adding a new figure-reasoning rule type requires changing three places and passing regression: spec.ts (validateRuleSpec), generators.ts, verify.ts (check-figure-engine catches tampering).

## Hard Rules

- API keys go only in `shangan/.env` (loaded via dotenv); code and .env.example may contain placeholders only.
- The server must run parseJsonLoose / validate the spec / sanitize SVG before returning AI results to the client — never pass through raw model output.
- Large question-bank files in src/data should be modified with the scripts/ maintenance scripts, not by hand.

## Branches

- `rednote` — 小红书小工具（minitool）打包适配的测试分支，仅为验证离线 zip 上传流程，**不要合并回 main**；产物见 `minitool/shangan-minitool.zip`（未跟踪）。

## Docs Index

- `DESIGN.md` — the scrapbook design system (tokens, drawably usage); read before any UI work
- `PRODUCT.md` — product positioning and users; read before making feature trade-offs
- `docs/prompt-engineering-review.md` + `docs/prompt-audit.md` — prompt-engineering rules and audit status; read before changing prompts.ts
- `docs/graphic-*-plan.md` — the three plans for the figure-reasoning engine / figure lab; read before touching figureEngine or PatternLab
- `docs/analytics-dashboard-plan.md` — learning-dashboard spec; read before touching AnalyticsView / analytics.ts

## Environment & Pitfalls

- The working directory must be `shangan/` (both dotenv and dist paths are relative to it); the env file is `shangan/.env`, not the .env.example in the parent directory.
- The project is not currently a git repo; the parent `learning-shangan/` is just a wrapper directory (PDF + .pi config).
- `bun.lock` and `package-lock.json` coexist; the script chain assumes npm/tsx/node — don't mix in bun.

## Exploration Tips

- To trace an AI feature's flow: `prompts.ts` builder → the matching route in `server.ts` → the fetch consumption in the component.
- To change user state, first look at the storage keys and migration table at the top of `App.tsx`, then `src/data/analytics.ts`.
