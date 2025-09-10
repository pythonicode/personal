'use server'

import { client } from '@/lib/actions'
import { z } from 'zod'
import { decrypt } from '@/lib/crypto'
import { ActionError } from '@/lib/actions'

const UnlockLinkSchema = z.object({
  encryptedUrl: z.string().min(1, 'Encrypted URL is required'),
  password: z.string().min(1, 'Password is required'),
})

export const unlockLink = client
  .schema(UnlockLinkSchema)
  .action(async ({ parsedInput: { encryptedUrl, password } }) => {
    let decryptedUrl
    try {
      // Decrypt the URL using the provided password
      decryptedUrl = await decrypt(decodeURIComponent(encryptedUrl), password)
    } catch (error) {
      throw new ActionError('Invalid password or corrupted link')
    }

    // Validate that the decrypted result is a valid URL
    const urlSchema = z.string().url()
    const result = urlSchema.safeParse(decryptedUrl)

    if (!result.success) {
      throw new ActionError('Invalid password or corrupted link')
    }

    // Return the decrypted URL
    return { decryptedUrl: result.data, password }
  })
