'use server'

import { client } from '@/lib/actions'
import { z } from 'zod'
import { decrypt } from '@/lib/crypto'
import { redirect } from 'next/navigation'

const UnlockLinkSchema = z.object({
  encryptedUrl: z.string().min(1, 'Encrypted URL is required'),
  password: z.string().min(1, 'Password is required'),
})

export const unlockLink = client
  .schema(UnlockLinkSchema)
  .action(async ({ parsedInput: { encryptedUrl, password } }) => {
    try {
      // Decrypt the URL using the provided password
      const decryptedUrl = await decrypt(decodeURIComponent(encryptedUrl), password)

      // Validate that the decrypted result is a valid URL
      const urlSchema = z.string().url()
      const validatedUrl = urlSchema.parse(decryptedUrl)

      // Redirect to the decrypted URL
      redirect(validatedUrl)
    } catch (error) {
      // If decryption fails or URL is invalid, throw an error
      throw new Error('Invalid password or corrupted link')
    }
  })
