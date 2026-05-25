import BlogCard from './BlogCard'
import type { BlogListItem } from '@/types/blog'

interface Props {
  posts: BlogListItem[]
  featuredFirst?: boolean
}

export default function BlogGrid({ posts, featuredFirst = false }: Props) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg font-serif">No posts yet. Check back soon.</p>
      </div>
    )
  }

  if (featuredFirst) {
    const [first, ...rest] = posts
    return (
      <div className="space-y-8">
        <BlogCard post={first} featured />
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
