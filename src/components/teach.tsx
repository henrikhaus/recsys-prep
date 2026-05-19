import { useState, type ReactNode } from 'react'
import {
  Lightbulb,
  KeyRound,
  TriangleAlert,
  GraduationCap,
  FlaskConical,
  ChevronDown,
} from 'lucide-react'
import { cn } from '#/lib/utils'

// --- text primitives ------------------------------------------------------
export function Lead({ children }: { children: ReactNode }) {
  return <p className="text-lg leading-relaxed text-[var(--sea-ink-soft)]">{children}</p>
}

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="display-title scroll-mt-24 text-2xl font-bold text-[var(--sea-ink)]"
    >
      {children}
    </h2>
  )
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-bold text-[var(--sea-ink)]">{children}</h3>
}

export function P({ children }: { children: ReactNode }) {
  return <p className="leading-relaxed text-[var(--sea-ink)]">{children}</p>
}

export function TX({ children }: { children: ReactNode }) {
  // emphasised inline term
  return <strong className="font-bold text-[var(--sea-ink)]">{children}</strong>
}

// --- callouts -------------------------------------------------------------
const calloutKinds = {
  note: { icon: Lightbulb, ring: 'rgba(79,184,178,0.4)', bg: 'rgba(79,184,178,0.1)', label: 'Note' },
  key: { icon: KeyRound, ring: 'rgba(47,106,74,0.4)', bg: 'rgba(47,106,74,0.09)', label: 'Key idea' },
  pitfall: {
    icon: TriangleAlert,
    ring: 'rgba(214,69,89,0.4)',
    bg: 'rgba(214,69,89,0.08)',
    label: 'Common mistake',
  },
  exam: {
    icon: GraduationCap,
    ring: 'rgba(214,158,46,0.45)',
    bg: 'rgba(214,158,46,0.1)',
    label: 'Exam tip',
  },
  example: {
    icon: FlaskConical,
    ring: 'rgba(23,58,64,0.28)',
    bg: 'rgba(23,58,64,0.05)',
    label: 'Worked example',
  },
}

export function Callout({
  kind = 'note',
  title,
  children,
}: {
  kind?: keyof typeof calloutKinds
  title?: string
  children: ReactNode
}) {
  const c = calloutKinds[kind]
  const Icon = c.icon
  return (
    <div
      className="rounded-xl border px-4 py-3.5"
      style={{ borderColor: c.ring, background: c.bg }}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <Icon size={16} className="text-[var(--sea-ink)]" />
        <span className="text-xs font-bold uppercase tracking-wide text-[var(--sea-ink)]">
          {title ?? c.label}
        </span>
      </div>
      <div className="space-y-2 text-sm leading-relaxed text-[var(--sea-ink)]">{children}</div>
    </div>
  )
}

// --- steps ----------------------------------------------------------------
export function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-fill)] text-sm font-bold text-[var(--accent-on)]">
            {i + 1}
          </span>
          <div className="pt-0.5 text-[var(--sea-ink)] leading-relaxed">{it}</div>
        </li>
      ))}
    </ol>
  )
}

// --- formula --------------------------------------------------------------
export function Formula({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-4 text-center">
      <div className="text-lg text-[var(--sea-ink)] [font-family:'Fraunces',Georgia,serif]">
        {children}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-xs text-[var(--sea-ink-soft)]">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

// inline math-ish helpers
export function M({ children }: { children: ReactNode }) {
  return <span className="[font-family:'Fraunces',Georgia,serif] italic">{children}</span>
}
export function Sub({ children }: { children: ReactNode }) {
  return <sub className="text-[0.7em]">{children}</sub>
}
export function Sup({ children }: { children: ReactNode }) {
  return <sup className="text-[0.7em]">{children}</sup>
}

// --- compare two things ---------------------------------------------------
export function Compare({
  a,
  b,
}: {
  a: { title: string; points: ReactNode[] }
  b: { title: string; points: ReactNode[] }
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[a, b].map((side, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4"
        >
          <div
            className={cn(
              'mb-2 text-sm font-bold',
              idx === 0 ? 'text-[var(--lagoon-deep)]' : 'text-[var(--palm)]',
            )}
          >
            {side.title}
          </div>
          <ul className="space-y-1.5 text-sm text-[var(--sea-ink)]">
            {side.points.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[var(--sea-ink-soft)]">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// --- reveal / self-check --------------------------------------------------
export function Reveal({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-[var(--sea-ink)]"
      >
        <span>{label}</span>
        <ChevronDown
          size={18}
          className={cn('shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open ? (
        <div className="border-t border-[var(--line)] px-4 py-3 text-sm leading-relaxed text-[var(--sea-ink)]">
          {children}
        </div>
      ) : null}
    </div>
  )
}

export function MiniCheck({ q, children }: { q: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[rgba(79,184,178,0.4)] bg-[rgba(79,184,178,0.07)] p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-md bg-[var(--accent-fill)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent-on)]">
          Check yourself
        </span>
      </div>
      <div className="mb-2 font-semibold text-[var(--sea-ink)]">{q}</div>
      <Reveal label="Show answer">{children}</Reveal>
    </div>
  )
}

// --- small list with checkmarks ------------------------------------------
export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5 text-[var(--sea-ink)] leading-relaxed">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-fill)]" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

// --- a simple data table --------------------------------------------------
export function DataTable({
  head,
  rows,
  caption,
}: {
  head: ReactNode[]
  rows: ReactNode[][]
  caption?: string
}) {
  return (
    <figure className="overflow-x-auto rounded-xl border border-[var(--line)]">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[rgba(23,58,64,0.06)]">
            {head.map((h, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-bold text-[var(--sea-ink)] border-b border-[var(--line)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="odd:bg-[rgba(23,58,64,0.06)] dark:odd:bg-[rgba(255,255,255,0.035)]"
            >
              {r.map((c, j) => (
                <td
                  key={j}
                  className="px-3 py-2 text-[var(--sea-ink)] border-b border-[var(--line)] tabular-nums"
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption ? (
        <figcaption className="px-3 py-2 text-xs text-[var(--sea-ink-soft)]">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
