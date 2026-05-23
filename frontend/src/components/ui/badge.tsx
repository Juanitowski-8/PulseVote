import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/15 text-primary',
        secondary: 'border-border bg-muted text-muted-foreground',
        success:
          'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-[#12382B] dark:bg-[#0B241B] dark:text-[#00F58A]',
        warning:
          'border-amber-200 bg-amber-50 text-amber-800 dark:border-[#12382B] dark:bg-[#0B241B] dark:text-[#F59E0B]',
        outline: 'border-border text-muted-foreground',
        destructive:
          'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
