"use client";

import { useState, useEffect } from 'react';
import { MapPin, Plus, Pencil, Trash2, Star, X, Loader2 } from 'lucide-react';
import { useCustomer } from '@/hooks/useCustomer';
import { toast } from 'sonner';

interface Address {
    id: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone: string | null;
}

const emptyForm = {
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: 'India',
    phone: '',
};

export default function AddressesPage() {
    const { customer, loading, isLoggedIn } = useCustomer();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (customer) {
            const addrs = customer.addresses?.edges?.map((e: any) => e.node) || [];
            setAddresses(addrs);
            setDefaultAddressId(customer.defaultAddress?.id || null);
        }
    }, [customer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const action = editingId ? 'update' : 'create';
            const res = await fetch('/api/auth/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    addressId: editingId,
                    address: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        address1: formData.address1,
                        address2: formData.address2 || undefined,
                        city: formData.city,
                        province: formData.province,
                        zip: formData.zip,
                        country: formData.country,
                        phone: formData.phone || undefined,
                    },
                }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(editingId ? 'Address updated' : 'Address added');
                resetForm();
                // Reload to refresh addresses
                window.location.reload();
            } else {
                toast.error(data.errors?.[0]?.message || 'Failed to save address');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (addressId: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const res = await fetch('/api/auth/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', addressId }),
            });
            const data = await res.json();
            if (data.success) {
                setAddresses(prev => prev.filter(a => a.id !== addressId));
                toast.success('Address deleted');
            } else {
                toast.error(data.errors?.[0]?.message || 'Failed to delete');
            }
        } catch {
            toast.error('Something went wrong');
        }
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            const res = await fetch('/api/auth/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'setDefault', addressId }),
            });
            const data = await res.json();
            if (data.success) {
                setDefaultAddressId(addressId);
                toast.success('Default address updated');
            } else {
                toast.error(data.errors?.[0]?.message || 'Failed to update');
            }
        } catch {
            toast.error('Something went wrong');
        }
    };

    const startEdit = (addr: Address) => {
        setEditingId(addr.id);
        setFormData({
            firstName: addr.firstName || '',
            lastName: addr.lastName || '',
            address1: addr.address1 || '',
            address2: addr.address2 || '',
            city: addr.city || '',
            province: addr.province || '',
            zip: addr.zip || '',
            country: addr.country || 'India',
            phone: addr.phone || '',
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData(emptyForm);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-stone-400" size={32} />
            </div>
        );
    }

    if (!isLoggedIn || !customer) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-12 border border-stone-200 text-center">
                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Please Sign In</h2>
                <p className="text-stone-600 mb-6">You need to be logged in to manage addresses</p>
                <a href="/login" className="inline-block px-6 py-3 bg-stone-900 text-white text-sm uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors">
                    Sign In
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-light text-stone-900">My Addresses</h1>
                    <p className="text-stone-500 text-sm mt-1">{addresses.length} saved {addresses.length === 1 ? 'address' : 'addresses'}</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors"
                    >
                        <Plus size={16} />
                        Add Address
                    </button>
                )}
            </div>

            {/* Address Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-serif text-stone-900">
                            {editingId ? 'Edit Address' : 'New Address'}
                        </h2>
                        <button onClick={resetForm} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                            <X size={18} className="text-stone-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">First Name</label>
                                <input
                                    type="text" required
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Last Name</label>
                                <input
                                    type="text" required
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Address Line 1</label>
                            <input
                                type="text" required
                                value={formData.address1}
                                onChange={e => setFormData({ ...formData, address1: e.target.value })}
                                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Address Line 2</label>
                            <input
                                type="text"
                                value={formData.address2}
                                onChange={e => setFormData({ ...formData, address2: e.target.value })}
                                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">City</label>
                                <input
                                    type="text" required
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">State / Province</label>
                                <input
                                    type="text" required
                                    value={formData.province}
                                    onChange={e => setFormData({ ...formData, province: e.target.value })}
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">PIN Code</label>
                                <input
                                    type="text" required
                                    value={formData.zip}
                                    onChange={e => setFormData({ ...formData, zip: e.target.value })}
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Country</label>
                                <input
                                    type="text" required
                                    value={formData.country}
                                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors disabled:opacity-50"
                            >
                                {submitting && <Loader2 size={14} className="animate-spin" />}
                                {editingId ? 'Update Address' : 'Save Address'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-3 border border-stone-200 text-stone-600 text-xs uppercase tracking-widest font-bold hover:bg-stone-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Address List */}
            {addresses.length === 0 && !showForm ? (
                <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                    <MapPin className="mx-auto text-stone-200 mb-4" size={64} strokeWidth={0.5} />
                    <h3 className="text-xl font-serif text-stone-800 mb-2">No Addresses Saved</h3>
                    <p className="text-stone-500 text-sm mb-6">Add a shipping address to speed up your checkout</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors"
                    >
                        <Plus size={16} />
                        Add Your First Address
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => {
                        const isDefault = addr.id === defaultAddressId;

                        return (
                            <div
                                key={addr.id}
                                className={`bg-white rounded-xl border p-5 relative group transition-all ${
                                    isDefault ? 'border-amber-300 ring-1 ring-amber-100' : 'border-stone-200 hover:border-stone-300'
                                }`}
                            >
                                {isDefault && (
                                    <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-[10px] uppercase tracking-widest font-bold rounded-full">
                                        <Star size={10} className="fill-amber-500" />
                                        Default
                                    </span>
                                )}

                                <div className="space-y-1 text-sm text-stone-700 pr-20">
                                    <p className="font-semibold text-stone-900">{addr.firstName} {addr.lastName}</p>
                                    <p>{addr.address1}</p>
                                    {addr.address2 && <p>{addr.address2}</p>}
                                    <p>{addr.city}, {addr.province} {addr.zip}</p>
                                    <p>{addr.country}</p>
                                    {addr.phone && <p className="text-stone-500">{addr.phone}</p>}
                                </div>

                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-100">
                                    <button
                                        onClick={() => startEdit(addr)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded transition-colors"
                                    >
                                        <Pencil size={12} /> Edit
                                    </button>
                                    {!isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                                        >
                                            <Star size={12} /> Set Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors ml-auto"
                                    >
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
