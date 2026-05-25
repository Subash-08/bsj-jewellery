import type { Metadata } from 'next';
import { getPolicy } from '@/lib/shopify/policies';
import PolicyLayout from '@/components/policies/PolicyLayout';

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPolicy('shippingPolicy');

  return {
    title: policy?.title
      ? `${policy.title} | Bakya by Bagyalakshmi Jewellers`
      : 'Shipping Policy | Bakya by Bagyalakshmi Jewellers',
    description:
      'Find out about shipping options, delivery times, and costs at Bakya by Bagyalakshmi Jewellers. We offer reliable delivery across India.',
  };
}

export default async function ShippingPolicyPage() {
  const policy = await getPolicy('shippingPolicy');

  return <PolicyLayout policy={policy} policyName="Shipping Policy" />;
}
