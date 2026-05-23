const CODE_CHARS = '{}[]<>/%#@&*01votes'.split('')

function CodeColumn({ offset }: { offset: number }) {
  const chars = Array.from({ length: 14 }, (_, i) => CODE_CHARS[(i + offset) % CODE_CHARS.length])
  return (
    <div
      className="flex flex-col items-center gap-0.5 font-mono text-[11px] leading-none"
      style={{ opacity: 0.15 + (offset % 5) * 0.12 }}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          className="text-emerald-400"
          style={{
            opacity: 1 - i * 0.06,
            textShadow: i < 4 ? '0 0 8px rgba(52, 211, 153, 0.5)' : 'none',
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
      className="pointer-events-none absolute bottom-0 left-1/2 w-full max-w-3xl -translate-x-1/2 select-none"
      aria-hidden
    >
      {/* Horizonte — arco verde tipo Daybreak */}
      <div className="relative mx-auto flex h-40 w-full max-w-md items-end justify-center">
        <div
          className="absolute bottom-8 h-28 w-56 rounded-[100%] opacity-90"
          style={{
            background:
              'linear-gradient(to top, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.5) 40%, rgba(6, 78, 59, 0.2) 70%, transparent 100%)',
            filter: 'blur(1px)',
          }}
        />
        <div
          className="absolute bottom-8 h-24 w-48 rounded-[100%]"
          style={{
            background:
              'linear-gradient(to top, #34d399 0%, #10b981 30%, #047857 60%, transparent 100%)',
          }}
        />
        <div className="absolute bottom-[4.5rem] left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
      </div>

      {/* Reflejo de “código” verde */}
      <div className="flex justify-center gap-1.5 pb-6 pt-2 sm:gap-2">
        {Array.from({ length: 28 }, (_, i) => (
          <CodeColumn key={i} offset={i * 3} />
        ))}
      </div>
    </div>
  )
}
