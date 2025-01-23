'use server'

import { z } from 'zod'
import { client } from '@/lib/actions'
import { verify } from '@/lib/crypto/signatures'
import { SendMessageSchema } from '@/lib/schemas/contact/send-message'

export const sendMessage = client
  .schema(SendMessageSchema)
  .action(async ({ parsedInput: { name, email, message, answer, signedAnswer } }) => {
    // Verify the captcha answer
    const isValid = verify(answer, signedAnswer)

    if (!isValid) {
      throw new Error('Invalid captcha answer')
    }

    // TODO: Implement email sending logic here
    // For now just return success
    console.log('Sending message...')
    console.log(name, email, message)
  })
