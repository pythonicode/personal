import React from 'react'
import { cn } from '@/lib/utils/css'
import { VariantProps, cva } from 'class-variance-authority'
import { RiLoader4Line } from '@remixicon/react'

const spinnerVariants = cva('flex-col items-center justify-center', {
  variants: {
    show: {
      true: 'flex',
      false: 'hidden',
    },
  },
  defaultVariants: {
    show: true,
  },
})

const loaderVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      small: 'size-6',
      medium: 'size-8',
      large: 'size-12',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
})

interface SpinnerContentProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string
  children?: React.ReactNode
}

export function Spinner({ size, show, children, className }: SpinnerContentProps) {
  return (
    <span className={spinnerVariants({ show })}>
      <RiLoader4Line className={cn(loaderVariants({ size }), className)} />
      {children}
    </span>
  )
}
