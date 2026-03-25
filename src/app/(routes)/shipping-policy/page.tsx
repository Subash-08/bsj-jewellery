import type { Metadata } from 'next';
import { getPolicy } from '@/lib/shopify/policies';
import PolicyLayout from '@/components/policies/PolicyLayout';

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPolicy('shippingPolicy');

  return {
    title: policy?.title
      ? `${policy.title} | BSJ Jewellers`
      : 'Shipping Policy | BSJ Jewellers',
    description:
      'Find out about shipping options, delivery times, and costs at BSJ Jewellers. We offer reliable delivery across India.',
  };
}

export default async function ShippingPolicyPage() {
  const policy = await getPolicy('shippingPolicy');

  return <PolicyLayout policy={policy} policyName="Shipping Policy" />;
}
