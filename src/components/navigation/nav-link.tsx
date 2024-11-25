'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils/css'
import { WaveEffect } from '../animations/wave-effect'

interface NavLinkProps {
  href: string
  children: ReactNode
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <WaveEffect>
      <Link
        href={href}
        className={cn(
          'px-4 py-2 rounded transition-colors text-sm text-neutral-700 dark:text-neutral-300 border border-transparent dark:bg-neutral-950',
          isActive
            && 'bg-neutral-100 dark:bg-neutral-900'
        )}
      >
        {children}
      </Link>
    </WaveEffect>
  )
}

export default NavLink
