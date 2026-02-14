import AccountSidebar from '@/components/account/AccountSidebar';

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-[120px]">
            <div className="flex max-w-[1920px] mx-auto">
                <AccountSidebar />
                <main className="flex-1 p-4 md:p-6 lg:p-8 w-full">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
