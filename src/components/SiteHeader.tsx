import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Waves, Moon, Sun, Menu, X } from 'lucide-react'
import { cn } from '#/lib/utils'

const NAV = [
  { to: '/learn', label: 'Topics' },
  { to: '/visualizers', label: 'Visualizers' },
  { to: '/quiz', label: 'Quizzes' },
  { to: '/exam', label: 'Past exams' },
  { to: '/drills', label: 'Drills' },
  { to: '/cheatsheet', label: 'Cheat sheet' },
]

function ThemeToggle() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const saved = window.localStorage.getItem('recsys-prep:theme')
    const isDark = saved === 'dark'
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])
  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    window.localStorage.setItem('recsys-prep:theme', next ? 'dark' : 'light')
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-2 text-[var(--sea-ink)] hover:border-[var(--lagoon-deep)]"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-md">
      <div className="page-wrap flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lagoon-deep)] text-white">
            <Waves size={19} />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-extrabold text-[var(--sea-ink)]">
              RecSys Prep
            </span>
            <span className="block text-[11px] font-semibold text-[var(--sea-ink-soft)]">
              TDT4215 exam trainer
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="nav-link text-sm font-semibold no-underline"
              activeProps={{ className: 'is-active' }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-2 text-[var(--sea-ink)] lg:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-[var(--line)] bg-[var(--header-bg)] lg:hidden">
          <div className="page-wrap flex flex-col py-2">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--sea-ink-soft)] no-underline',
                )}
                activeProps={{ className: 'bg-[var(--link-bg-hover)] text-[var(--sea-ink)]' }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
