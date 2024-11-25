'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils/css'

interface NavLinkProps {
  href: string
  children: ReactNode
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        'px-4 py-2 rounded transition-colors text-sm text-neutral-700 dark:text-neutral-300',
        isActive
          ? 'bg-neutral-100 dark:bg-neutral-800'
          : 'hover:bg-neutral-50 dark:hover:bg-neutral-700',
      )}
    >
      {children}
    </Link>
  )
}

export default NavLink
