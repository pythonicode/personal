import { env } from '@/env'
import Image from 'next/image'
import Link from 'next/link'
import { ComponentProps } from 'react'

type LinkImageProps = ComponentProps<typeof Image> & {
  href?: string
}

export function LinkImage({ href, className = '', ...props }: LinkImageProps) {
  const imageElement = <Image {...props} className={`rounded ${className}`} />

  return <Link href={href ?? `${env.NEXT_PUBLIC_URL}${props.src}`}>{imageElement}</Link>
}
