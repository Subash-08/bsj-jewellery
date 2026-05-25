import BlogCard from './BlogCard'
import type { BlogListItem } from '@/types/blog'

interface Props {
  posts: BlogListItem[]
}

export default function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null

  return (
    <section>
      <h2 className="text-xl font-serif font-semibold text-[#230532] mb-6">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
