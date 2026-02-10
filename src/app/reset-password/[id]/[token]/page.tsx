import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset Password',
    robots: {
        index: false,
        follow: false,
    },
};

type Props = {
    params: Promise<{ id: string; token: string }>
}

export default async function ResetPasswordPage({ params }: Props) {
    const { id, token } = await params;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <ResetPasswordForm id={id} token={token} />
        </div>
    );
}
