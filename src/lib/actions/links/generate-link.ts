'use server'

import { client } from '@/lib/actions'
import { z } from 'zod'
import { encrypt } from '@/lib/crypto'
import { env } from '@/env'

const GenerateLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
})

export const generateLink = client
  .schema(GenerateLinkSchema)
  .action(async ({ parsedInput: { url } }) => {
    // Encrypt the URL
    const encryptedUrl = await encrypt(url, env.LINK_PASSWORD)

    // Create the shareable link
    const shareableLink = `${env.NEXT_PUBLIC_URL}/links/${encodeURIComponent(encryptedUrl)}`

    return {
      originalUrl: url,
      shareableLink,
    }
  })
