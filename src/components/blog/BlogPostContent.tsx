import { MDXRemote } from 'next-mdx-remote/rsc'

interface Props {
  content: string
}

export default function BlogPostContent({ content }: Props) {
  return (
    <article
      className="
        prose prose-stone prose-base max-w-none
        prose-headings:font-serif prose-headings:text-[#230532]
        prose-h2:text-xl prose-h3:text-lg
        prose-a:text-[#230532] prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900
        prose-img:w-full prose-img:shadow-sm
        prose-blockquote:border-l-[#D4AF37] prose-blockquote:bg-amber-50/40
        prose-blockquote:not-italic prose-blockquote:py-0.5
        prose-code:text-[#230532] prose-code:bg-stone-100 prose-code:px-1
        prose-pre:bg-stone-900 prose-pre:text-stone-100
      "
    >
      <MDXRemote source={content} />
    </article>
  )
}
