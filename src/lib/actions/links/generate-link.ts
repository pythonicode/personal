'use server'

import { ActionError, client } from '@/lib/actions'
import { z } from 'zod'
import { encrypt } from '@/lib/crypto'
import { env } from '@/env'

const GenerateLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  password: z.string().min(1, 'Password is required'),
})

export const generateLink = client
  .schema(GenerateLinkSchema)
  .action(async ({ parsedInput: { url, password } }) => {
    // Encrypt the URL using user-provided password
    try {
    const encryptedUrl = await encrypt(url, password)

    // Create the shareable link
    const shareableLink = `${env.NEXT_PUBLIC_URL}/links/${encodeURIComponent(encryptedUrl)}`

    return {
        originalUrl: url,
        shareableLink,
      }
    } catch (error) {
      throw new ActionError('Failed to generate link')
    }
  })
