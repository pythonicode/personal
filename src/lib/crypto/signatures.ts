import { createHmac } from 'crypto'
import { env } from '@/env'

export function sign(value: string, secret: string = env.SIGNING_SECRET): string {
  return createHmac('sha256', secret).update(value).digest('hex')
}

export function verify(
  value: string,
  signature: string,
  secret: string = env.SIGNING_SECRET,
): string {
  const expectedSignature = sign(value, secret)

  if (expectedSignature !== signature) {
    throw new Error('Invalid signature')
  }

  return value
}
