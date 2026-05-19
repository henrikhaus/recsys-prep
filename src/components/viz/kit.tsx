import type { ReactNode } from 'react'
import { cn } from '#/lib/utils'

// Shared UI building blocks for the interactive visualizers.

export function VizPanel({
  title,
  children,
  className,
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4',
        className,
      )}
    >
      {title ? (
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--sea-ink-soft)]">
          {title}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export function NumInput({
  value,
  onChange,
  step = 1,
  min,
  max,
  className,
}: {
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
  className?: string
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : ''}
      step={step}
      min={min}
      max={max}
      onChange={(e) => {
        const v = parseFloat(e.target.value)
        onChange(Number.isFinite(v) ? v : 0)
      }}
      className={cn(
        'w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-2 py-1.5 text-center text-sm font-semibold text-[var(--sea-ink)] tabular-nums focus:border-[var(--lagoon-deep)] focus:outline-none',
        className,
      )}
    />
  )
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  display,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  display?: string
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-semibold text-[var(--sea-ink)]">{label}</span>
        <span className="font-bold tabular-nums text-[var(--lagoon-deep)]">
          {display ?? value}
        </span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[var(--lagoon-deep)]"
      />
    </label>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
            value === o.value
              ? 'bg-[var(--lagoon-deep)] text-white'
              : 'text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)]',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function ResultRow({
  label,
  value,
  hint,
  strong,
}: {
  label: ReactNode
  value: ReactNode
  hint?: string
  strong?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-3 rounded-lg px-3 py-2',
        strong ? 'bg-[rgba(79,184,178,0.14)]' : 'bg-[rgba(23,58,64,0.04)]',
      )}
    >
      <span className="text-sm text-[var(--sea-ink)]">{label}</span>
      <span className="flex items-baseline gap-2">
        {hint ? <span className="text-xs text-[var(--sea-ink-soft)]">{hint}</span> : null}
        <span
          className={cn(
            'font-bold tabular-nums',
            strong ? 'text-base text-[var(--lagoon-deep)]' : 'text-sm text-[var(--sea-ink)]',
          )}
        >
          {value}
        </span>
      </span>
    </div>
  )
}

export function Bar({
  value,
  max,
  label,
  caption,
  tone = 'lagoon',
}: {
  value: number
  max: number
  label: ReactNode
  caption?: ReactNode
  tone?: 'lagoon' | 'palm' | 'amber' | 'rose' | 'muted'
}) {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) * 100 : 0
  const colors: Record<string, string> = {
    lagoon: 'var(--lagoon-deep)',
    palm: 'var(--palm)',
    amber: '#d69e2e',
    rose: '#c0445b',
    muted: 'rgba(23,58,64,0.3)',
  }
  return (
    <div>
      <div className="mb-0.5 flex items-baseline justify-between text-sm">
        <span className="font-semibold text-[var(--sea-ink)]">{label}</span>
        {caption ? (
          <span className="text-xs font-bold tabular-nums text-[var(--sea-ink-soft)]">
            {caption}
          </span>
        ) : null}
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-[rgba(23,58,64,0.08)]">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%`, background: colors[tone] }}
        />
      </div>
    </div>
  )
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg bg-[rgba(214,158,46,0.1)] px-3 py-2 text-sm leading-relaxed text-[var(--sea-ink)]">
      {children}
    </p>
  )
}
