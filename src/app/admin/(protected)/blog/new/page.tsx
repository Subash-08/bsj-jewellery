import BlogWizard from '@/components/admin/blog/BlogWizard'

export default function AdminNewPostPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-serif font-semibold text-[#230532]">New Post</h1>
        <p className="text-sm text-gray-500 mt-0.5">Create a new blog post in 3 steps</p>
      </div>
      <BlogWizard />
    </div>
  )
}
