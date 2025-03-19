'use server'

import { generateCaptcha } from '@/lib/actions/captcha/generate-captcha'
import { ContactForm } from './form'
import { RenderCaptcha } from '@/components/captcha'

export async function ContactFormServer() {
  const result = await generateCaptcha()

  if (!result?.data) {
    throw new Error('Failed to generate captcha')
  }

  return (
    <ContactForm
      signedAnswer={result.data.signedAnswer}
      captcha={<RenderCaptcha base64={result.data.base64} />}
    />
  )
}
