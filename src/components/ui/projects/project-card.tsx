import Image from 'next/image'
import Link from 'next/link'
import { WaveEffect } from '@/components/animations/wave-effect'
import { RiExternalLinkLine } from '@remixicon/react'

type ProjectCardProps = {
  href: string
  title: string
  description: string
  image: string
  external: boolean
}

function displayUrl(href: string, external: boolean) {
  if (external) {
    return href.replace(/^https?:\/\//, '')
  }
  return `anthonyriley.org${href}`
}

export function ProjectCard({ href, title, description, image, external }: ProjectCardProps) {
  return (
    <Link
      href={href}
      className="flex h-full w-full"
      {...(external ? { target: '_blank' as const, rel: 'noopener noreferrer' as const } : {})}
    >
      <WaveEffect className='w-full h-full'>
        <article className="group relative flex h-full w-full flex-col overflow-hidden border border-border bg-background transition-colors duration-500 hover:border-foreground">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={image}
              alt={`${title} preview`}
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(min-width: 768px) 42rem, 100vw"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
              <span className="min-w-0 truncate font-mono text-xs" title={displayUrl(href, external)}>
                {displayUrl(href, external)}
              </span>
              {external ? (
                <span className="inline-flex shrink-0 items-center gap-0.5 text-xs" title="Opens in a new tab">
                  <RiExternalLinkLine className="size-3.5" aria-hidden />
                </span>
              ) : (
                <span className="shrink-0 bg-muted px-2 py-0.5 text-xs">Here</span>
              )}
            </div>

            <h2 className="text-xl font-semibold text-foreground transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
              {title}
            </h2>

            <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>
          </div>
          <span
            className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-out group-hover:scale-x-100"
            aria-hidden
          />
          <span aria-hidden className="card-edge-shine" />
        </article>
      </WaveEffect>
    </Link>
  )
}
