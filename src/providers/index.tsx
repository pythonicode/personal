import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <div className="hidden">
        <div className="bg-cyan-500" />
        <div className="bg-purple-500" />
        <div className="bg-rose-500" />
        <div className="bg-green-500" />
        <div className="bg-orange-500" />
        <div className="bg-yellow-500" />
        <div className="bg-gray-500" />
      </div>
      <ThemeProvider attribute="data-mode">{children}</ThemeProvider>
    </TooltipProvider>
  )
}
