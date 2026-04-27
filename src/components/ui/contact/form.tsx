'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '../button'
import { RiSendPlane2Fill } from '@remixicon/react'
import { revealEmail } from '@/lib/actions/contact/reveal-email'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/css'

const ContactForm = ({
  signedAnswer,
  captcha,
  compact = false,
}: {
  signedAnswer: string
  captcha: React.ReactNode
  compact?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState('')
  const [email, setEmail] = useState('get my email address')
  const [isRevealed, setIsRevealed] = useState(false)

  const { execute, status, result } = useAction(revealEmail, {
    onSuccess: ({ data }) => {
      if (data) {
        setEmail(data)
        setOpen(false)
        setAnswer('')
        setIsRevealed(true)
        toast.success('Email revealed')
      }
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    execute({ answer: answer.trim(), signedAnswer })
  }

  return (
    <div
      className={cn(
        compact
          ? 'flex flex-row items-center mt-2 gap-2 w-full max-w-[min(18rem,100%)]'
          : 'flex flex-col gap-2 w-80',
      )}
    >
      <div className={cn('relative', compact && 'min-w-0 flex-1')}>
        <Input
          readOnly
          value={email}
          className={cn(
            'w-full cursor-pointer',
            compact && 'h-7 px-2 text-xs',
          )}
          onClick={() => !isRevealed && setOpen(true)}
        />
      </div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size={compact ? 'sm' : 'default'}
            disabled={isRevealed}
            className={cn(
              !compact && 'w-full',
              compact && 'h-7 shrink-0 px-2.5 text-xs',
            )}
          >
            {isRevealed
              ? compact
                ? 'Done'
                : 'Email Revealed'
              : compact
                ? 'Reveal'
                : 'Click to Reveal'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-4">
          {captcha}
          <div className="flex items-center gap-2 mt-2">
            <Input
              id="captcha"
              placeholder="Answer (to 2 decimal places)"
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <Button size="icon" onClick={handleSubmit} className="w-8 h-8">
              <RiSendPlane2Fill className="w-4 h-4" />
            </Button>
          </div>
          {status === 'hasErrored' && (
            <p className="text-xs text-red-500 mt-1">
              {result.serverError ??
                Object.values(result.validationErrors?.fieldErrors ?? {})
                  .flat()
                  .at(0) ??
                result.validationErrors?.formErrors?.at(0)}
            </p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { ContactForm }
