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
          'px-2.5 py-2 text-sm text-foreground border border-transparent transition-colors sm:px-3.5',
          isActive && 'bg-muted-background',
        )}
      >
        {children}
      </Link>
    </WaveEffect>
  )
}

export default NavLink
