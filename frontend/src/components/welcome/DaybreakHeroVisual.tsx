const CODE_CHARS = '{}[]<>/%#@&*01votes'.split('')

function CodeColumn({ offset }: { offset: number }) {
  const chars = Array.from({ length: 16 }, (_, i) => CODE_CHARS[(i + offset) % CODE_CHARS.length])
  const glow = 0.35 + (offset % 4) * 0.15
  return (
    <div
      className="led-code-column flex flex-col items-center gap-0.5 font-mono text-[11px] leading-none"
      style={{ animationDelay: `${offset * 0.15}s` }}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          className="text-[#4dff91]"
          style={{
            opacity: Math.max(0.1, 1 - i * 0.055),
            textShadow:
              i < 5
                ? `0 0 10px rgba(77, 255, 145, ${glow}), 0 0 20px rgba(16, 185, 129, 0.4)`
                : '0 0 4px rgba(77, 255, 145, 0.2)',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  )
}

export function DaybreakHeroVisual() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-1/2 w-full max-w-4xl -translate-x-1/2 select-none"
      aria-hidden
    >
      <div className="relative mx-auto flex h-44 w-full max-w-lg items-end justify-center">
        {/* Glow exterior LED */}
        <div className="led-sun-glow absolute bottom-6 h-32 w-72 rounded-[100%]" />
        {/* Núcleo brillante */}
        <div className="led-sun-core absolute bottom-7 h-24 w-52 rounded-[100%]" />
        {/* Línea de horizonte LED */}
        <div className="led-horizon-line absolute bottom-[4.75rem] left-0 right-0 h-[2px]" />
      </div>

      <div className="flex justify-center gap-1.5 pb-8 pt-1 sm:gap-2">
        {Array.from({ length: 32 }, (_, i) => (
          <CodeColumn key={i} offset={i * 2} />
        ))}
      </div>
    </div>
  )
}
