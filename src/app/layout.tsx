import type { Metadata } from 'next'
import './globals.css'

import importFont from 'next/font/local'
import BottomNav from '@/components/navigation/bottom-nav'
import Providers from '@/providers'
import { cn } from '@/lib/utils/css'

const font = importFont({
  src: './font.woff2',
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Anthony Riley',
  description:
    "Welcome to my website! I am a fullstack software engineer and manager with a passion for creating intuitive and beautiful experiences for users on web and mobile. Here I like to share my interests in health, endurance, music and technology. I also use this site as a store of memory for what I've said, read, seen or done, as well as an experimentation ground for new technology, unique design and interesting findings.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.variable, 'font-sans')}>
        <Providers>
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
