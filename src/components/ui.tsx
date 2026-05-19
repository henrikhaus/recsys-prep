import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '#/lib/utils'

// --- Button ---------------------------------------------------------------
const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap select-none disabled:opacity-45 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lagoon-deep)]',
  {
    variants: {
      variant: {
        primary:
          'text-white bg-[var(--lagoon-deep)] hover:bg-[#246f76] shadow-[0_8px_20px_rgba(50,143,151,0.32)] dark:bg-[var(--lagoon)] dark:text-[#062227] dark:hover:bg-[var(--lagoon-deep)]',
        ink: 'text-white bg-[var(--sea-ink)] hover:opacity-90 dark:text-[#0a1418]',
        outline:
          'border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink)] hover:border-[var(--lagoon-deep)]',
        ghost: 'text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]',
        soft: 'bg-[var(--chip-bg)] border border-[var(--chip-line)] text-[var(--palm)] hover:bg-[var(--surface-strong)]',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-sm px-4 py-2.5',
        lg: 'text-base px-6 py-3',
        icon: 'p-2',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export function Button({
  className,
  variant,
  size,
  ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonStyles>) {
  return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />
}

// --- Badge ----------------------------------------------------------------
const badgeTones: Record<string, string> = {
  lagoon: 'bg-[rgba(79,184,178,0.18)] text-[var(--lagoon-deep)]',
  palm: 'bg-[rgba(47,106,74,0.14)] text-[var(--palm)]',
  ink: 'bg-[rgba(23,58,64,0.1)] text-[var(--sea-ink)]',
  amber: 'bg-[rgba(214,158,46,0.18)] text-[#a9701a]',
  rose: 'bg-[rgba(214,69,89,0.16)] text-[#b23a4c]',
  neutral: 'bg-[var(--chip-bg)] text-[var(--sea-ink-soft)]',
}

export function Badge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: keyof typeof badgeTones
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

// --- Card -----------------------------------------------------------------
export function Card({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('island-shell rounded-2xl', className)} {...props}>
      {children}
    </div>
  )
}

// --- ProgressBar ----------------------------------------------------------
export function ProgressBar({
  value,
  className,
  tone = 'lagoon',
}: {
  value: number // 0..1
  className?: string
  tone?: 'lagoon' | 'palm' | 'amber'
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  const fill =
    tone === 'palm'
      ? 'linear-gradient(90deg,#2f6a4a,#5aa87a)'
      : tone === 'amber'
        ? 'linear-gradient(90deg,#d69e2e,#e8c069)'
        : 'linear-gradient(90deg,var(--lagoon-deep),#7ed3bf)'
  return (
    <div
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-[rgba(23,58,64,0.1)]',
        className,
      )}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${pct}%`, background: fill }}
      />
    </div>
  )
}

// --- Kicker (small uppercase label) --------------------------------------
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('island-kicker', className)}>{children}</div>
}

// --- Stat ------------------------------------------------------------------
export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3">
      <div className="text-[1.6rem] font-bold leading-none text-[var(--sea-ink)] tabular-nums">
        {value}
      </div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
        {label}
      </div>
      {hint ? <div className="mt-0.5 text-xs text-[var(--sea-ink-soft)]">{hint}</div> : null}
    </div>
  )
}
