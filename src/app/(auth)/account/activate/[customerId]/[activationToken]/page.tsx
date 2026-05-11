import ActivateAccountForm from '@/components/auth/ActivateAccountForm';

export const metadata = {
    title: 'Activate Account - BSJ Jewellers',
};

export default function ActivateAccountPage({
    params,
}: {
    params: { customerId: string; activationToken: string };
}) {
    return (
        <div className="min-h-screen flex bg-white">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                .font-playfair { font-family: 'Playfair Display', serif; }
            `}</style>
            <div className="flex-1 flex items-center justify-center px-6 py-16 bg-white">
                <ActivateAccountForm />
            </div>
        </div>
    );
}
