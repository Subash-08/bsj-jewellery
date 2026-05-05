import { RegisterForm } from '@/components/auth/RegisterForm';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Create Account',
    robots: {
        index: false,
        follow: false,
    },
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex bg-white">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                .font-playfair { font-family: 'Playfair Display', serif; }
            `}</style>

            {/* Left Panel – Hero Image */}
            <div className="hidden md:flex md:w-1/2 relative">
                <Image
                    src="/login-img.png"
                    alt="BSJ Jewellery Register"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-[#230532]/40" />
                {/* Brand tagline */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-8 text-center">
                    <p className="text-white/80 font-montserrat italic text-sm tracking-wide">
                        Begin your journey with timeless elegance
                    </p>
                </div>
            </div>

            {/* Right Panel – Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-16 bg-white">
                <RegisterForm />
            </div>
        </div>
    );
}
