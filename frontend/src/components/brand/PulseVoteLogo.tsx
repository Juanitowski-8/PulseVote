import { useId } from 'react'
import { cn } from '@/utils/cn'

export type PulseVoteLogoProps = {
  className?: string
  showText?: boolean
  size?: number
  textClassName?: string
  /** Glow sutil del isotipo (default: true en hero, false en navbar) */
  glow?: boolean
}

export function PulseVoteLogo({
  className,
  showText = true,
  size = 42,
  textClassName,
  glow = true,
}: PulseVoteLogoProps) {
  const uid = useId().replace(/:/g, '')
  const gradientId = `pulsevote-gradient-${uid}`
  const glowId = `pulsevote-glow-${uid}`

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'shrink-0',
          glow && 'drop-shadow-[0_0_14px_rgba(0,245,138,0.18)]',
        )}
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="20" y1="18" x2="98" y2="105">
            <stop offset="0%" stopColor="#00F58A" />
            <stop offset="48%" stopColor="#00B86B" />
            <stop offset="100%" stopColor="#006B45" />
          </linearGradient>
          {glow && (
            <filter
              id={glowId}
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0.96  0 0 0 0 0.54  0 0 0 0.28 0"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        <g
          stroke={`url(#${gradientId})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={glow ? `url(#${glowId})` : undefined}
        >
          <path d="M22 56C22 34 39 20 60 20C81 20 98 34 98 56" />
          <path d="M22 68C34 64 33 52 34 45C36 32 47 26 60 26C76 26 88 38 88 55V66" />
          <path d="M28 82C25 69 35 63 42 58C48 54 48 46 50 40C52 34 56 32 61 32C70 32 78 39 78 49V57" />
          <path d="M43 96C35 82 39 70 50 65C58 61 60 53 60 45" />
          <path d="M55 101C72 105 86 97 88 82C89 75 88 71 88 71" />
          <path d="M98 68C93 65 90 63 88 60" />
          <path d="M101 81C96 78 93 77 90 75" />
          <path d="M54 82V68" />
          <path d="M66 82V59" />
          <path d="M78 82V49" />
          <path d="M45 55L57 67L83 40" />
        </g>
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

export function PulseVoteBrand({ className, logoSize = 26, nameClassName }: PulseVoteBrandProps) {
  return (
    <PulseVoteLogo
      size={logoSize}
      showText
      glow={false}
      className={cn('gap-2', className)}
      textClassName={cn('text-[15px] font-semibold text-[#F3FFF8]', nameClassName)}
    />
  )
}
