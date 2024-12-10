import { MDXContent } from '@content-collections/mdx/react'
import { RiArrowLeftLine, RiHomeLine } from '@remixicon/react'
import { allPosts } from 'content-collections'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'

const components = {
  // Text elements
  p: (props: any) => <p className="text-foreground leading-7 mb-4" {...props} />,
  strong: (props: any) => <strong className="font-bold text-foreground" {...props} />,
  em: (props: any) => <em className="italic text-foreground" {...props} />,
  del: (props: any) => <del className="line-through text-muted-foreground" {...props} />,

  // Headings
  h1: (props: any) => <h1 className="text-4xl font-bold text-foreground mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold text-foreground mt-8 mb-4" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-bold text-foreground mt-6 mb-3" {...props} />,
  h4: (props: any) => <h4 className="text-xl font-bold text-foreground mt-6 mb-3" {...props} />,
  h5: (props: any) => <h5 className="text-lg font-bold text-foreground mt-4 mb-2" {...props} />,
  h6: (props: any) => <h6 className="text-base font-bold text-foreground mt-4 mb-2" {...props} />,

  // Lists
  ul: (props: any) => <ul className="list-disc list-inside text-foreground mb-4 ml-4" {...props} />,
  ol: (props: any) => (
    <ol className="list-decimal list-inside text-foreground mb-4 ml-4" {...props} />
  ),
  li: (props: any) => <li className="text-foreground mb-1" {...props} />,

  // Code
  code: (props: any) => (
    <code className="bg-muted-background text-foreground rounded px-1 py-0.5 text-sm" {...props} />
  ),
  pre: (props: any) => (
    <pre
      className="bg-muted-background text-foreground p-4 rounded-lg overflow-x-auto mb-4"
      {...props}
    />
  ),

  // Links
  a: (props: any) => (
    <a
      className="text-cyan-500 hover:underline transition-colors"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    />
  ),

  // Blockquote
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-accent pl-4 italic text-muted-foreground mb-4"
      {...props}
    />
  ),

  // Table
  table: (props: any) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border-collapse text-foreground" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-muted-background" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr className="border-b border-border" {...props} />,
  th: (props: any) => <th className="p-2 text-left font-bold" {...props} />,
  td: (props: any) => <td className="p-2" {...props} />,

  // Horizontal Rule
  hr: (props: any) => <hr className="border-border my-8" {...props} />,
}

const posts = allPosts
  .filter((post) => post.archived === false && post.draft === false)
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts.find((post) => post._meta.path === slug)

  if (!post) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted-foreground">Post not found</p>
      </div>
    )
  }

  return (
    <article className="max-w-screen-sm mx-auto px-4 py-8">
      <header className="mb-8 border-b border-border pb-4">
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/posts"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"
          >
            <RiArrowLeftLine size={16} /> Back to all posts
          </Link>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"
          >
            <RiHomeLine size={16} /> Home
          </Link>
        </div>

        <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
          <Image src={post.image} alt={post.title} className="object-cover" fill />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{post.title}</h1>

        <div className="flex justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            {post.updatedAt !== post.createdAt && (
              <div className="flex items-center gap-1 italic">
                <span>Updated</span>
                <time dateTime={post.updatedAt}>
                  {new Date(post.updatedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </div>
            )}
          </div>

          <span>{Math.round(post.content.split(' ').length / 250)} min read</span>
        </div>

        <div className="flex items-center gap-2 justify-between mt-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6 text-xs text-white">
              <AvatarImage src={post.author.avatar ?? ''} />
              <AvatarFallback>
                {post.author.name.split(' ')[0].charAt(0) +
                  post.author.name.split(' ')[1].charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{post.author.name}</span>
          </div>
        </div>
      </header>

      <div className="prose prose-lg prose-invert max-w-none">
        <MDXContent components={components} code={post.mdx} />
      </div>

      <footer className="mt-16 pt-8 border-t border-border pb-16">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {(() => {
            const currentIndex = posts.findIndex((p) => p._meta.path === post._meta.path)
            const prevPost = posts[currentIndex + 1]

            if (prevPost) {
              return (
                <a
                  href={`/posts/${prevPost._meta.path}`}
                  className="group flex-1 p-4 rounded-lg border border-border hover:bg-muted-background transition-colors"
                >
                  <span className="text-sm text-muted-foreground">Previous Post</span>
                  <h3 className="text-foreground font-medium mt-1 group-hover:text-cyan-400 transition-colors">
                    {prevPost.title}
                  </h3>
                </a>
              )
            }
          })()}

          {(() => {
            const currentIndex = posts.findIndex((p) => p._meta.path === post._meta.path)
            const nextPost = posts[currentIndex - 1]

            if (nextPost) {
              return (
                <a
                  href={`/posts/${nextPost._meta.path}`}
                  className="group flex-1 p-4 rounded border border-border hover:bg-muted-background transition-colors text-right"
                >
                  <span className="text-sm text-muted-foreground">Next Post</span>
                  <h3 className="text-foreground font-medium mt-1 group-hover:text-cyan-400 transition-colors">
                    {nextPost.title}
                  </h3>
                </a>
              )
            }
          })()}
        </div>
      </footer>
    </article>
  )
}
