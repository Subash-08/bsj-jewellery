import AccountSidebar from '@/components/account/AccountSidebar';

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#FAF8F5] pt-[120px]">
            <div className="flex flex-col lg:flex-row max-w-[1920px] mx-auto">
                <AccountSidebar />
                <main className="flex-1 p-4 md:p-6 lg:p-8 xl:p-10 w-full">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
