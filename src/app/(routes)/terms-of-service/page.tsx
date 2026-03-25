import type { Metadata } from 'next';
import { getPolicy } from '@/lib/shopify/policies';
import PolicyLayout from '@/components/policies/PolicyLayout';

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPolicy('termsOfService');

  return {
    title: policy?.title
      ? `${policy.title} | BSJ Jewellers`
      : 'Terms of Service | BSJ Jewellers',
    description:
      'Review the terms of service for BSJ Jewellers. By using our website, you agree to these terms and conditions.',
  };
}

export default async function TermsOfServicePage() {
  const policy = await getPolicy('termsOfService');

  return <PolicyLayout policy={policy} policyName="Terms of Service" />;
}
