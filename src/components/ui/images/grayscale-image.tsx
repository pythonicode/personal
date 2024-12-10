import { LinkImage } from './link-image'
import { ComponentProps } from 'react'

type GrayscaleImageProps = ComponentProps<typeof LinkImage>

export function GrayscaleImage({ className = '', ...props }: GrayscaleImageProps) {
  return (
    <LinkImage {...props} className={`grayscale hover:grayscale-0 transition-all ${className}`} />
  )
}
