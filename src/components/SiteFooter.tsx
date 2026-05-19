import { Link } from '@tanstack/react-router'
import { Waves } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="site-footer mt-20">
      <div className="page-wrap flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-fill)] text-[var(--accent-on)]">
            <Waves size={16} />
          </span>
          <div className="text-sm text-[var(--sea-ink-soft)]">
            <span className="font-bold text-[var(--sea-ink)]">RecSys Prep</span> — a study tool
            for TDT4215 Recommender Systems.
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <Link to="/learn" className="no-underline text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]">
            Topics
          </Link>
          <Link to="/exam" className="no-underline text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]">
            Past exams
          </Link>
          <Link
            to="/cheatsheet"
            className="no-underline text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]"
          >
            Cheat sheet
          </Link>
        </div>
      </div>
      <div className="page-wrap pb-6 text-xs text-[var(--sea-ink-soft)]">
        Built for personal exam revision. Content is summarised from the course lectures and past
        exam papers — always cross-check with the official course material.
      </div>
    </footer>
  )
}
