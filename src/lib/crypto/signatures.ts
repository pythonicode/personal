import { createHmac } from 'crypto'
import { env } from '@/env'

export function sign(value: string, secret: string = env.SIGNING_SECRET): string {
  return createHmac('sha256', secret).update(value).digest('hex')
}

export function verify(
  value: string,
  signedValue: string,
  secret: string = env.SIGNING_SECRET,
): boolean {
  const expectedSignature = sign(value, secret)
  return expectedSignature === signedValue
}
