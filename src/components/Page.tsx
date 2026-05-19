import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { Kicker } from '#/components/ui'

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="page-wrap rise-in py-10">{children}</div>
}

export function PageHero({
  kicker,
  title,
  lead,
  children,
}: {
  kicker?: string
  title: ReactNode
  lead?: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="mb-8">
      {kicker ? <Kicker className="mb-2">{kicker}</Kicker> : null}
      <h1 className="display-title text-3xl font-bold leading-tight text-[var(--sea-ink)] sm:text-4xl">
        {title}
      </h1>
      {lead ? (
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--sea-ink-soft)]">{lead}</p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </header>
  )
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--sea-ink-soft)] no-underline hover:text-[var(--sea-ink)]"
    >
      <ChevronLeft size={16} />
      {label}
    </Link>
  )
}
