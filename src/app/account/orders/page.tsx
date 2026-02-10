import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCustomer } from '@/lib/shopify/client';
import { env } from '@/lib/env';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!accessToken) {
        redirect('/login');
    }

    const customer = await getCustomer(accessToken);

    if (!customer) {
        cookieStore.delete(env.AUTH_COOKIE_NAME);
        redirect('/login');
    }

    const orders = customer.orders?.edges?.map((edge: any) => edge.node) || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Order History
                    </h2>
                    <Link href="/account" className="text-sm text-blue-600 hover:text-blue-500 mt-2 block">
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {orders.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                        <Link href="/collections" className="mt-4 inline-block bg-black text-white px-4 py-2 rounded-md">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {orders.map((order: any) => (
                            <li key={order.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-blue-600 truncate">
                                            Order #{order.orderNumber}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.financialStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.financialStatus}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                Total: {order.totalPrice.amount} {order.totalPrice.currencyCode}
                                            </p>
                                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                Fulfillment: {order.fulfillmentStatus}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Date: {new Date(order.processedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
