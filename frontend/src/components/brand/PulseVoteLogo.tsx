import { cn } from '@/utils/cn'

export type PulseVoteLogoProps = {
  className?: string
  showText?: boolean
  size?: number
  textClassName?: string
  glow?: boolean
}

/** Isotipo ultra minimalista: hoja de encuesta (contorno + 2 líneas + check). */
export function PulseVoteLogo({
  className,
  showText = true,
  size = 42,
  textClassName,
  glow = false,
}: PulseVoteLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'shrink-0 text-pv-primary',
          glow && 'drop-shadow-[0_0_14px_rgb(var(--primary)/0.25)]',
        )}
        aria-hidden
      >
        <rect
          x="4.5"
          y="3"
          width="15"
          height="18"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <line x1="8" y1="8.5" x2="16" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line
          x1="8"
          y1="12"
          x2="13.5"
          y2="12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M8 16.5l2 2 5.5-5.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span className={cn('select-none font-semibold tracking-tight', textClassName ?? 'text-2xl')}>
          {textClassName ? (
            'PulseVote'
          ) : (
            <span className="landing-brand-text">PulseVote</span>
          )}
        </span>
      )}
    </div>
  )
}

type PulseVoteBrandProps = {
  className?: string
  logoSize?: number
  nameClassName?: string
}

export function PulseVoteBrand({ className, logoSize = 28, nameClassName }: PulseVoteBrandProps) {
  return (
    <PulseVoteLogo
      size={logoSize}
      showText
      glow={false}
      className={cn('gap-2', className)}
      textClassName={cn('text-[15px] font-semibold text-pv-main', nameClassName)}
    />
  )
}
