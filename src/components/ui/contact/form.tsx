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
import { buttonVariants } from '../button'

interface ContactFormData {
  name: string
  email: string
  message: string
}

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

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
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: 'outline' })}>
          Submit Message
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-4">
          {captcha}
          <Input className="mt-2" placeholder="Enter Captcha" required />
        </DropdownMenuContent>
      </DropdownMenu>
    </form>
  )
}

export { ContactForm }
