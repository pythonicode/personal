'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { RiSunLine, RiMoonLine, RiComputerLine } from '@remixicon/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils/css'
import { Spinner } from '../ui/spinner'

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn(
          'py-2 px-2.5 aspect-square rounded transition-colors flex items-center justify-center',
          'hover:bg-neutral-50 dark:hover:bg-neutral-700',
        )}
        aria-label="Toggle theme"
      >
        <Spinner className="w-4 h-4" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'py-2 px-2.5 aspect-square rounded transition-colors',
            'hover:bg-neutral-50 dark:hover:bg-neutral-700',
          )}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <RiSunLine className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
          ) : theme === 'dark' ? (
            <RiMoonLine className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
          ) : (
            <RiComputerLine className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
          )}
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <RiSunLine className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <RiMoonLine className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <RiComputerLine className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeToggle
