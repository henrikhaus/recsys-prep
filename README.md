# RecSys Prep — TDT4215 exam trainer

An interactive study tool for the **TDT4215 Recommender Systems** exam at NTNU.
Built to go from the lecture list to exam-ready as time-efficiently as possible.

## What's inside

- **12 topic guides** — one per lecture (Foundations → Attacks), with worked
  examples, common-mistake callouts, exam tips and flip-to-reveal self-checks.
- **8 interactive visualizers** — cosine/Pearson similarity, kNN neighbourhood
  explorer, matrix factorization, TF-IDF, an evaluation-metrics lab, a
  multi-armed bandit simulator, an A/B / A/A test simulator and a context
  sparsity explorer. Every input is editable and recomputes live.
- **Concept quizzes** — 50+ multiple-choice questions with instant explanations,
  per topic or shuffled.
- **Past exams** — the 2022–2025 TDT4215 papers reproduced with model answers
  (interactive MCQs, reveal-able essay answers).
- **Calculation drills** — endless randomised numeric problems (TF-IDF, cosine,
  RMSE, MAE, ARHR, precision@k, Kendall's τ, matrix factorization) with
  step-by-step solutions.
- **Cheat sheet** — every formula and definition on one page.

Progress (completed topics, quiz scores, drill accuracy) is saved locally in the
browser via `localStorage` — there is no backend.

## Tech stack

TanStack Start · React 19 · TypeScript · Tailwind CSS v4 · Vite · Bun

## Getting started

```bash
bun install
bun run dev      # dev server on http://localhost:3000
bun run build    # production build
```

## Disclaimer

Content is summarised from the course lectures and past exam papers for personal
revision. Always cross-check against the official course material.
