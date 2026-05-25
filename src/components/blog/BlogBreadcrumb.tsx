import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Crumb {
  label: string
  href?: string
}

interface Props {
  crumbs: Crumb[]
}

export default function BlogBreadcrumb({ crumbs }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
      <Link href="/" className="hover:text-[#230532] transition-colors">
        Home
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3 shrink-0" />
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-[#230532] transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-800">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
