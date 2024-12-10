'use client'

import { motion } from 'motion/react'

type TiltHoverProps = {
  children: React.ReactNode
  degrees?: number
  duration?: number
}

export function TiltHover({ children, degrees = -1, duration = 0.1 }: TiltHoverProps) {
  return (
    <motion.div
      whileHover={{
        rotate: degrees,
        transition: { duration },
      }}
    >
      {children}
    </motion.div>
  )
}
