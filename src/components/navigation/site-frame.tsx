'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) {
    return children
  }

  return (
    <div className="mx-auto min-h-dvh max-w-screen-lg border-x border-line">{children}</div>
  )
}
