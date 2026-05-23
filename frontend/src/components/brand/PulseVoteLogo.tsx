import { useId } from 'react'
import { cn } from '@/utils/cn'

export type PulseVoteLogoProps = {
  className?: string
  showText?: boolean
  size?: number
  textClassName?: string
  glow?: boolean
}

/**
 * Isotipo PulseVote — lectura clara en 3 capas:
 * 1) Arcos superiores = señal en vivo (pulse)
 * 2) Check central = voto confirmado
 * 3) Barras inferiores = resultados / encuesta
 */
export function PulseVoteLogo({
  className,
  showText = true,
  size = 42,
  textClassName,
  glow = true,
}: PulseVoteLogoProps) {
  const uid = useId().replace(/:/g, '')
  const gradientId = `pv-grad-${uid}`
  const glowId = `pv-glow-${uid}`

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
          glow && 'drop-shadow-[0_0_12px_rgba(0,245,138,0.16)]',
        )}
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="24" y1="16" x2="96" y2="104">
            <stop offset="0%" stopColor="#00F58A" />
            <stop offset="50%" stopColor="#00B86B" />
            <stop offset="100%" stopColor="#006B45" />
          </linearGradient>
          {glow && (
            <filter
              id={glowId}
              x="-25%"
              y="-25%"
              width="150%"
              height="150%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0.9  0 0 0 0 0.5  0 0 0 0.22 0"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        <g filter={glow ? `url(#${glowId})` : undefined}>
          {/* Marco — lectura como icono de app */}
          <rect
            x="8"
            y="8"
            width="104"
            height="104"
            rx="24"
            fill="#071A14"
            stroke={`url(#${gradientId})`}
            strokeWidth="2.5"
          />

          {/* Pulse / tiempo real */}
          <g
            stroke={`url(#${gradientId})`}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          >
            <path d="M26 56C26 30 42 14 60 14C78 14 94 30 94 56" />
            <path d="M38 58C38 40 48 28 60 28C72 28 82 40 82 58" />
          </g>

          {/* Voto confirmado */}
          <path
            d="M40 54L54 74L88 42"
            stroke={`url(#${gradientId})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Resultados de encuesta */}
          <g fill={`url(#${gradientId})`}>
            <rect x="32" y="84" width="16" height="20" rx="4" />
            <rect x="52" y="72" width="16" height="32" rx="4" />
            <rect x="72" y="56" width="16" height="48" rx="4" />
          </g>
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

export function PulseVoteBrand({ className, logoSize = 28, nameClassName }: PulseVoteBrandProps) {
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
