'use client'

import { cn } from '@/lib/utils/css'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ReactNode, useRef } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

export function EdgeGleam({
  axis,
  className,
  delay = '0s',
}: {
  axis: 'x' | 'y'
  className?: string
  delay?: string
}) {
  return (
    <span
      aria-hidden
      style={{ animationDelay: delay }}
      className={cn(
        'pointer-events-none absolute',
        axis === 'x' ? 'inset-x-0 h-px gleam-x' : 'inset-y-0 w-px gleam-y',
        className,
      )}
    />
  )
}

export function LineSection({
  id,
  className,
  children,
  fade = true,
  shineDelay = '0s',
}: {
  id?: string
  className?: string
  children: ReactNode
  fade?: boolean
  shineDelay?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const shown = reduce || inView

  return (
    <motion.section
      id={id}
      ref={ref}
      className={cn('relative', className)}
      initial={reduce || !fade ? false : { opacity: 0, y: 10 }}
      animate={!fade || shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.7, ease }}
    >
      <span
        aria-hidden
        style={{ animationDelay: shineDelay }}
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left gleam-x transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]',
          shown ? 'scale-x-100' : 'scale-x-0',
        )}
      />
      {children}
    </motion.section>
  )
}
