import type { Metadata } from 'next';
import { getPolicy } from '@/lib/shopify/policies';
import PolicyLayout from '@/components/policies/PolicyLayout';

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPolicy('privacyPolicy');

  return {
    title: policy?.title
      ? `${policy.title} | Bakya by Bagyalakshmi Jewellers`
      : 'Privacy Policy | Bakya by Bagyalakshmi Jewellers',
    description:
      'Read our privacy policy to understand how Bakya by Bagyalakshmi Jewellers collects, uses, and protects your personal information.',
  };
}

export default async function PrivacyPolicyPage() {
  const policy = await getPolicy('privacyPolicy');

  return <PolicyLayout policy={policy} policyName="Privacy Policy" />;
}
