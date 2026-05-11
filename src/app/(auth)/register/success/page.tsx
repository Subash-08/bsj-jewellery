import Link from 'next/link';

export default function RegisterSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                .font-playfair { font-family: 'Playfair Display', serif; }
            `}</style>
            <div className="max-w-[420px] w-full text-center">
                <h2 className="font-playfair text-[28px] md:text-[34px] font-semibold text-[#18181b] leading-tight mb-4">
                    Check Your Email
                </h2>
                <p className="font-montserrat text-[14px] text-[#6b6b6b] mb-8 leading-relaxed">
                    We've sent an activation link to your email address. Please check your inbox (and spam folder) to activate your account.
                </p>
                <Link
                    href="/login"
                    className="inline-block w-full bg-[#230532] text-white py-3.5 rounded-[4px] font-jakarta text-[14px] font-semibold hover:opacity-90 transition-opacity tracking-wide"
                >
                    Return to Login
                </Link>
            </div>
        </div>
    );
}
