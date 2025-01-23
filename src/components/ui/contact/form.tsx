'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RenderCaptcha } from '@/components/captcha'
import { Button, buttonVariants } from '../button'
import { RiPlaneFill, RiSendPlane2Fill } from '@remixicon/react'
import { sendMessage } from '@/lib/actions/contact/send-message'
import { useAction } from 'next-safe-action/hooks'
import { z } from 'zod'
import { SendMessageSchema } from '@/lib/schemas/contact/send-message'
type ContactFormData =
  z.infer<typeof SendMessageSchema> extends infer T ? Omit<T, 'answer' | 'signedAnswer'> : never

const ContactForm = ({
  base64,
  signedAnswer,
  captcha,
}: {
  base64: string
  signedAnswer: string
  captcha: React.ReactNode
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const [answer, setAnswer] = useState('')

  const { execute, status, result } = useAction(sendMessage, {
    onSuccess: () => {
      console.log('Message sent successfully')
    },
    onError: (error) => {
      console.error('Error sending message:', error)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ ...formData, answer, signedAnswer })
    execute({ ...formData, answer, signedAnswer })
  }

  const [open, setOpen] = useState(false)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
      <Input
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full"
      />
      <Input
        name="email"
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        required
      />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className={buttonVariants({ variant: 'outline' })} disabled={open}>
          Submit Message
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
            <Button size="icon" type="submit" onClick={handleSubmit} className="w-8 h-8">
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
    </form>
  )
}

export { ContactForm }
