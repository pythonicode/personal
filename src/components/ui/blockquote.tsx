import React from 'react'
import { cn } from '@/lib/utils/css'

type BlockquoteProps = {
  children?: React.ReactNode
  className?: string
}

const Blockquote = ({ children, className }: BlockquoteProps) => {
  return (
    <div
      className={cn(
        "relative rounded border-l-4 border-l-foreground bg-muted-background py-4 pl-8 pr-4 font-sans italic leading-relaxed text-muted-foreground before:absolute before:left-3 before:top-3 before:font-serif before:text-3xl before:text-foreground before:content-['“']",
        className,
      )}
    >
      {children}
    </div>
  )
}

const BlockquoteAuthor = ({ children, className }: BlockquoteProps) => {
  return (
    <p className={cn('mt-2 pr-4 text-right font-bold not-italic text-muted-foreground', className)}>
      - {children}
    </p>
  )
}

export { Blockquote, BlockquoteAuthor }
