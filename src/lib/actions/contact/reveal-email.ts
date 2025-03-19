'use server'

import { client } from '@/lib/actions'
import { verify } from '@/lib/crypto/signatures'
import { RevealEmailSchema } from '@/lib/schemas/contact/send-message'
import { env } from '@/env'

export const revealEmail = client
  .schema(RevealEmailSchema)
  .action(async ({ parsedInput: { answer, signedAnswer } }) => {
    // Verify the captcha answer
    const isValid = verify(answer, signedAnswer)

    if (!isValid) {
      throw new Error('Invalid captcha answer')
    }

    return env.EMAIL
  })
