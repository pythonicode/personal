import { allPosts } from 'content-collections'
import { Post } from '@/components/ui/posts/post'

const posts = allPosts
  .filter((post) => post.archived === false && post.draft === false)
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

export default function Posts() {
  return (
    <main className="max-w-screen-lg mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Post
            key={post._meta.path}
            title={post.title}
            description={post.content}
            image={post.image}
            updatedAt={new Date(post.updatedAt)}
            createdAt={new Date(post.createdAt)}
            readingTime={Math.round(post.content.split(' ').length / 250)}
            tags={post.tags}
            slug={post._meta.path}
          />
        ))}
      </div>
    </main>
  )
}
