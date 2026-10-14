'use client'

import { cn } from '@/lib/utils/css'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ReactNode, useRef } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })
  const reduce = useReducedMotion()
  const shown = reduce || inView

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.65, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export function DrawY({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })
  const reduce = useReducedMotion()
  const shown = reduce || inView

  return (
    <span ref={ref} aria-hidden className={cn('absolute w-px', className)}>
      <span
        className={cn(
          'block h-full w-full origin-top gleam-y transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]',
          shown ? 'scale-y-100' : 'scale-y-0',
        )}
      />
    </span>
  )
}
