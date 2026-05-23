import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface SectionContainerProps {
  children: ReactNode
  className?: string
}

export function SectionContainer({ children, className }: SectionContainerProps) {
  return <section className={cn('space-y-6', className)}>{children}</section>
}
