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
 * Isotipo minimalista: hoja de encuesta.
 * Hoja estilizada + líneas de formulario + marca de voto.
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
          glow && 'drop-shadow-[0_0_10px_rgba(0,245,138,0.14)]',
        )}
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="30" y1="20" x2="90" y2="100">
            <stop offset="0%" stopColor="#00F58A" />
            <stop offset="55%" stopColor="#00B86B" />
            <stop offset="100%" stopColor="#006B45" />
          </linearGradient>
        </defs>

        <rect
          x="10"
          y="10"
          width="100"
          height="100"
          rx="22"
          fill="#071A14"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeOpacity="0.7"
        />

        {/* Hoja / ficha de encuesta */}
        <path
          d="M38 34C38 34 42 28 60 28C78 28 82 34 82 34V88C82 88 78 94 60 94C42 94 38 88 38 88V34Z"
          fill={`url(#${gradientId})`}
          fillOpacity="0.12"
        />
        <path
          d="M42 38C42 38 46 32 60 32C74 32 78 38 78 38V84C78 84 74 90 60 90C46 90 42 84 42 84V38Z"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Líneas de encuesta */}
        <line x1="48" y1="48" x2="72" y2="48" stroke={`url(#${gradientId})`} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        <line x1="48" y1="58" x2="68" y2="58" stroke={`url(#${gradientId})`} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
        <line x1="48" y1="68" x2="64" y2="68" stroke={`url(#${gradientId})`} strokeWidth="3" strokeLinecap="round" opacity="0.3" />

        {/* Voto / selección */}
        <circle cx="52" cy="78" r="5" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" opacity="0.5" />
        <path
          d="M62 76L66 80L76 70"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
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
      textClassName={cn('text-[15px] font-semibold text-[#F3FFF8]', nameClassName)}
    />
  )
}
