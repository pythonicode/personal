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
          'px-4 py-2 rounded transition-colors bg-opacity-80 text-sm text-foreground border border-transparent',
          isActive && 'bg-muted-background',
        )}
      >
        {children}
      </Link>
    </WaveEffect>
  )
}

export default NavLink
