import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils/css'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background shadow hover:bg-foreground/90',
        destructive: 'bg-accent text-background hover:bg-accent/90',
        outline:
          'border border-border bg-background hover:bg-muted-background hover:text-muted-foreground',
        secondary: 'bg-muted-background text-muted-foreground hover:bg-muted-background/80',
        ghost: 'hover:bg-muted-background hover:text-muted-foreground',
        link: 'text-accent underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-3 py-1 h-7',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-4 py-2',
        icon: 'h-6 w-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
