import Link from 'next/link'
import Image from 'next/image'
import { WaveEffect } from '@/components/animations/wave-effect'

type FeaturedPostProps = {
  title: string
  description: string
  image: string
  createdAt: Date
  readingTime: number
  tags: string[]
  slug: string
}

export function FeaturedPost({
  title,
  description,
  image,
  createdAt,
  readingTime,
  tags,
  slug,
}: FeaturedPostProps) {
  return (
    <Link href={`/posts/${slug}`} className="flex h-full w-full">
      <WaveEffect className="h-full w-full">
        <article className="group relative flex h-full w-full flex-col overflow-hidden border border-border bg-background transition-colors duration-200 hover:border-foreground">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
              <time dateTime={createdAt.toISOString()}>
                {createdAt.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
              <span>{readingTime} min read</span>
            </div>

            <h2 className="text-xl font-semibold text-foreground transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
              {title}
            </h2>

            <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>

            <div className="mt-auto flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <span
            className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-foreground transition-transform duration-300 group-hover:scale-x-100"
            aria-hidden
          />
        </article>
      </WaveEffect>
    </Link>
  )
}
