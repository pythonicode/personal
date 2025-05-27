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

const ContactForm = ({
  signedAnswer,
  captcha,
}: {
  signedAnswer: string
  captcha: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState('')
  const [email, setEmail] = useState('***********************')
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
    <div className="flex flex-col gap-2 w-80">
      <div className="relative">
        <Input
          readOnly
          value={email}
          className="w-full cursor-pointer"
          onClick={() => !isRevealed && setOpen(true)}
        />
      </div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="w-full" variant="outline" disabled={isRevealed}>
            {isRevealed ? 'Email Revealed' : 'Click to Reveal'}
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
