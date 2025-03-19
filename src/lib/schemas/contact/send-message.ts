import { z } from 'zod'

export const RevealEmailSchema = z.object({
  answer: z.string().min(1, 'Answer is required'),
  signedAnswer: z.string().min(1, 'Invalid answer'),
})
