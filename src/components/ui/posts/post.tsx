import Link from 'next/link'
import Image from 'next/image'
import { WaveEffect } from '@/components/animations/wave-effect'

type PostProps = {
  title: string
  description: string
  image: string
  createdAt: Date
  readingTime: number
  tags: string[]
  slug: string
}

export function Post({ title, description, image, createdAt, readingTime, tags, slug }: PostProps) {
  return (
    <Link href={`/posts/${slug}`} className="grow w-full">
      <WaveEffect className="w-full grow">
        <article className="group relative flex flex-col md:flex-row overflow-hidden rounded border border-border bg-background transition-colors hover:bg-muted-background">
          <div className="relative aspect-video md:aspect-square md:max-w-40 min-h-40 shrink-0 overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex grow overflow-hidden flex-col gap-2 p-4">
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

            <h2 className="md:text-lg font-semibold text-foreground line-clamp-1 -my-1">
              {title}
            </h2>

            <p className="line-clamp-2 text-xs md:text-sm text-muted-foreground">{description}</p>

            <div className="mt-auto flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </WaveEffect>
    </Link>
  )
}
