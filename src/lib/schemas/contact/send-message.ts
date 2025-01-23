import { z } from 'zod'

export const SendMessageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(1, 'Message is required'),
  answer: z.string().min(1, 'Answer is required'),
  signedAnswer: z.string().min(1, 'Invalid answer'),
})
