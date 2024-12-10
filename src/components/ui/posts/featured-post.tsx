import Link from 'next/link'
import Image from 'next/image'

type FeaturedPostProps = {
  title: string
  description: string
  image: string
  updatedAt: Date
  createdAt: Date
  readingTime: number
  tags: string[]
  slug: string
}

export function FeaturedPost({
  title,
  description,
  image,
  updatedAt,
  createdAt,
  readingTime,
  tags,
  slug,
}: FeaturedPostProps) {
  console.log({
    updatedAt: typeof updatedAt,
    createdAt: typeof createdAt,
  })

  return (
    <Link href={`/posts/${slug}`}>
      <article className="group relative flex flex-col overflow-hidden rounded border border-border bg-background transition-colors hover:bg-muted-background">
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

          <h2 className="text-xl font-semibold text-foreground">{title}</h2>

          <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>

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
    </Link>
  )
}
