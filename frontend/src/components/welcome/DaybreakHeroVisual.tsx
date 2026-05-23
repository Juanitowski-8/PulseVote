const CODE_CHARS = '{}[]<>/%#@&*01votes'.split('')

function CodeColumn({ offset }: { offset: number }) {
  const chars = Array.from({ length: 18 }, (_, i) => CODE_CHARS[(i + offset) % CODE_CHARS.length])
  const duration = 5 + (offset % 5) * 0.85
  const delay = (offset % 12) * 0.35

  return (
    <div
      className="led-code-column relative h-44 w-3 overflow-hidden font-mono text-[11px] leading-none"
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      <div className="led-code-stream flex flex-col items-center gap-0.5">
        {chars.map((char, i) => (
          <span
            key={`a-${i}`}
            className="text-[#4dff91]"
            style={{
              opacity: Math.max(0.12, 1 - i * 0.05),
              textShadow:
                i < 4
                  ? '0 0 12px rgba(77, 255, 145, 0.85), 0 0 24px rgba(16, 185, 129, 0.45)'
                  : '0 0 4px rgba(77, 255, 145, 0.25)',
            }}
          >
            {char}
          </span>
        ))}
        {chars.map((char, i) => (
          <span
            key={`b-${i}`}
            className="text-[#4dff91]/40"
            style={{ opacity: Math.max(0.05, 0.5 - i * 0.04) }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  )
}

export function DaybreakHeroVisual() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-1/2 z-[1] w-full max-w-5xl -translate-x-1/2 select-none"
      aria-hidden
    >
      <div className="relative mx-auto flex h-48 w-full max-w-lg items-end justify-center">
        <div className="led-sun-glow absolute bottom-8 h-36 w-80 rounded-[100%]" />
        <div className="led-sun-core absolute bottom-9 h-28 w-56 rounded-[100%]" />
        <div className="led-horizon-line absolute bottom-[5.25rem] left-0 right-0 h-[2px]" />
      </div>

      <div className="relative flex justify-center gap-1 pb-10 pt-2 sm:gap-1.5">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent" />
        {Array.from({ length: 36 }, (_, i) => (
          <CodeColumn key={i} offset={i * 2} />
        ))}
      </div>
    </div>
  )
}
