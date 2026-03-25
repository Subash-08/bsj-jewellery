import Link from 'next/link';
import type { PolicyContent } from '@/lib/shopify/policies';

type PolicyLayoutProps = {
  policy: PolicyContent;
  policyName: string;
};

export default function PolicyLayout({ policy, policyName }: PolicyLayoutProps) {
  if (!policy) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-4 mt-70">
        <div className="text-center max-w-md mx-auto">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(201,169,110,0.1)' }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: '#C9A96E' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1
            className="text-2xl mb-3"
            style={{ fontFamily: 'var(--font-heading)', color: '#0f0f0f' }}
          >
            {policyName}
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            This policy content is not available at the moment. Please check back
            later or{' '}
            <Link
              href="/contact"
              className="underline"
              style={{ color: '#C9A96E' }}
            >
              contact us
            </Link>{' '}
            for more information.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 mt-20">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-gray-700"
                style={{ color: '#9ca3af' }}
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="select-none" style={{ color: '#d1d5db' }}>
              /
            </li>
            <li>
              <span style={{ color: '#C9A96E' }}>{policyName}</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Title */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <h1
          className="text-3xl sm:text-4xl tracking-tight"
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#0f0f0f',
            fontWeight: 600,
          }}
        >
          {policy.title || policyName}
        </h1>
      </div>

      {/* Gold divider */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="h-px w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #C9A96E 30%, #C9A96E 70%, transparent 100%)',
          }}
        />
      </div>

      {/* Policy body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <style dangerouslySetInnerHTML={{
          __html: `
          .luxury-policy h2 {
            font-family: var(--font-heading);
            font-size: 1.75rem;
            color: #0f0f0f;
            margin-top: 3rem;
            margin-bottom: 1.25rem;
            font-weight: 500;
            letter-spacing: -0.02em;
          }
          .luxury-policy p {
            color: #4b5563;
            line-height: 1.8;
            margin-bottom: 1.25rem;
            font-size: 1rem;
          }
          .luxury-policy ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-bottom: 2rem;
          }
          .luxury-policy li {
            color: #4b5563;
            line-height: 1.8;
            margin-bottom: 0.5rem;
            padding-left: 0.25rem;
          }
          .luxury-policy table {
            width: 100%;
            text-align: left;
            border-collapse: collapse;
            margin-top: 2rem;
            margin-bottom: 2.5rem;
          }
          .luxury-policy th {
            border-bottom: 1px solid #e5e7eb;
            padding: 1rem 0;
            font-weight: 500;
            color: #111827;
          }
          .luxury-policy td {
            border-bottom: 1px solid #f3f4f6;
            padding: 1rem 0;
            color: #4b5563;
          }
          .luxury-policy strong {
            color: #111827;
            font-weight: 600;
          }
          .luxury-policy a {
            color: #C9A96E;
            text-decoration: underline;
            text-decoration-thickness: 1px;
            text-underline-offset: 2px;
            transition: color 0.15s ease;
          }
          .luxury-policy a:hover {
            color: #0f0f0f;
          }
        `}} />
        <div
          className="luxury-policy"
          dangerouslySetInnerHTML={{ __html: policy.body }}
        />
      </div>

      {/* Bottom divider */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="h-px w-full mb-6"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #C9A96E 30%, #C9A96E 70%, transparent 100%)',
          }}
        />
        <p className="text-xs text-gray-400 text-center">
          If you have any questions about this policy, please{' '}
          <Link
            href="/contact"
            className="underline transition-colors"
            style={{ color: '#C9A96E' }}
          >
            contact us
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
