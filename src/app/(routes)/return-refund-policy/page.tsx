import type { Metadata } from 'next';
import { getPolicy } from '@/lib/shopify/policies';
import PolicyLayout from '@/components/policies/PolicyLayout';

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPolicy('refundPolicy');

  return {
    title: policy?.title
      ? `${policy.title} | BSJ Jewellers`
      : 'Refund Policy | BSJ Jewellers',
    description:
      'Learn about our refund and return policy at BSJ Jewellers. We want you to be completely satisfied with your purchase.',
  };
}

export default async function RefundPolicyPage() {
  const policy = await getPolicy('refundPolicy');

  return <PolicyLayout policy={policy} policyName="Refund Policy" />;
}
