"use client";

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { customer, isAuthenticated, isLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (customer) {
            setProfileData({
                firstName: customer.firstName || '',
                lastName: customer.lastName || '',
                email: customer.email || '',
                phone: customer.phone || ''
            });
        }
    }, [customer]);

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-16 bg-white/60 rounded-xl"></div>
                <div className="h-48 bg-white/60 rounded-xl"></div>
                <div className="h-64 bg-white/60 rounded-xl"></div>
            </div>
        );
    }

    if (!isAuthenticated || !customer) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-12 border border-stone-200/60 text-center">
                <h2 className="text-2xl font-serif text-stone-900 mb-3">Please Sign In</h2>
                <p className="text-stone-500 text-sm mb-6">You need to be logged in to view your profile</p>
                <a
                    href="/login"
                    className="inline-block px-8 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors"
                >
                    Sign In
                </a>
            </div>
        );
    }

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    phone: profileData.phone || undefined,
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Profile updated successfully');
                setIsEditing(false);
            } else {
                toast.error(data.errors?.[0]?.message || 'Failed to update profile');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        toast.info('Password change is managed through Shopify');
        setShowPasswordForm(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const getInitials = () => {
        const firstInitial = customer.firstName?.charAt(0) || '';
        const lastInitial = customer.lastName?.charAt(0) || '';
        return (firstInitial + lastInitial) || customer.email.charAt(0).toUpperCase();
    };

    const displayName = customer.firstName && customer.lastName
        ? `${customer.firstName} ${customer.lastName}`
        : customer.firstName || 'User';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif font-light text-stone-900">My Profile</h1>
                <p className="text-stone-500 text-sm mt-1">Manage your personal information</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-stone-200/60 p-6">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-3xl font-bold shadow-md flex-shrink-0">
                        {getInitials()}
                    </div>
                    <div>
                        <h3 className="text-xl font-medium text-stone-900 mb-0.5">{displayName}</h3>
                        <p className="text-stone-500 text-sm">{customer.email}</p>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl border border-stone-200/60 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-serif text-stone-900">Personal Information</h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors"
                        >
                            Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">
                                <span className="flex items-center gap-1.5"><User size={12} /> First Name</span>
                            </label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                value={isEditing ? profileData.firstName : (customer.firstName || '-')}
                                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                className={`w-full px-4 py-3 border border-stone-200 rounded-lg text-sm ${isEditing ? 'focus:ring-2 focus:ring-stone-300 focus:border-stone-400' : 'bg-stone-50 text-stone-600'}`}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">
                                <span className="flex items-center gap-1.5"><User size={12} /> Last Name</span>
                            </label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                value={isEditing ? profileData.lastName : (customer.lastName || '-')}
                                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                className={`w-full px-4 py-3 border border-stone-200 rounded-lg text-sm ${isEditing ? 'focus:ring-2 focus:ring-stone-300 focus:border-stone-400' : 'bg-stone-50 text-stone-600'}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">
                            <span className="flex items-center gap-1.5"><Mail size={12} /> Email Address</span>
                        </label>
                        <input
                            type="email"
                            disabled
                            value={customer.email}
                            className="w-full px-4 py-3 border border-stone-200 rounded-lg bg-stone-50 text-stone-600 cursor-not-allowed text-sm"
                        />
                        <p className="text-[11px] text-stone-400 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">
                            <span className="flex items-center gap-1.5"><Phone size={12} /> Phone Number</span>
                        </label>
                        <input
                            type="tel"
                            disabled={!isEditing}
                            value={isEditing ? profileData.phone : (customer.phone || '-')}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className={`w-full px-4 py-3 border border-stone-200 rounded-lg text-sm ${isEditing ? 'focus:ring-2 focus:ring-stone-300 focus:border-stone-400' : 'bg-stone-50 text-stone-600'}`}
                        />
                    </div>

                    {isEditing && (
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    if (customer) {
                                        setProfileData({
                                            firstName: customer.firstName || '',
                                            lastName: customer.lastName || '',
                                            email: customer.email || '',
                                            phone: customer.phone || ''
                                        });
                                    }
                                }}
                                className="px-6 py-3 border border-stone-200 text-stone-600 text-xs uppercase tracking-widest font-bold hover:bg-stone-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Password & Security */}
            <div className="bg-white rounded-2xl border border-stone-200/60 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-serif text-stone-900 flex items-center gap-2">
                            <Lock className="text-stone-400" size={18} />
                            Password & Security
                        </h2>
                        <p className="text-xs text-stone-500 mt-1">Keep your account secure</p>
                    </div>
                    {!showPasswordForm && (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="px-4 py-2 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors"
                        >
                            Change
                        </button>
                    )}
                </div>

                {showPasswordForm && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Current Password</label>
                            <input
                                type="password"
                                required
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 text-sm"
                                placeholder="Enter current password"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">New Password</label>
                            <input
                                type="password"
                                required
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 text-sm"
                                placeholder="Enter new password"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 text-sm"
                                placeholder="Confirm new password"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors"
                            >
                                Update Password
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="px-6 py-3 border border-stone-200 text-stone-600 text-xs uppercase tracking-widest font-bold hover:bg-stone-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
