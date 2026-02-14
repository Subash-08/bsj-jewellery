"use client";

import { useState } from 'react';
import { User, Mail, Phone, Lock, Camera, Save } from 'lucide-react';
import { useCustomer } from '@/hooks/useCustomer';

export default function ProfilePage() {
    const { customer, loading, isLoggedIn } = useCustomer();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
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

    // Initialize form data when customer loads
    useState(() => {
        if (customer) {
            setProfileData({
                firstName: customer.firstName || '',
                lastName: customer.lastName || '',
                email: customer.email || '',
                phone: customer.phone || ''
            });
        }
    });

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-12 border border-stone-200 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
                    <p className="mt-4 text-stone-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn || !customer) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-12 border border-stone-200 text-center">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Please Sign In</h2>
                    <p className="text-stone-600 mb-6">You need to be logged in to view your profile</p>
                    <a
                        href="/login"
                        className="inline-block px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
                    >
                        Sign In
                    </a>
                </div>
            </div>
        );
    }

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);
        // TODO: Integrate with Shopify Customer Update API
        alert('Profile update functionality coming soon!');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        // TODO: Integrate with Shopify Customer Password Update
        alert('Password change functionality coming soon!');
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
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
                <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">My Profile</h1>
                <p className="text-stone-600">Manage your personal information</p>
            </div>

            {/* Profile Picture */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
                <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Profile Picture</h2>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                            {getInitials()}
                        </div>
                        <button className="absolute bottom-0 right-0 w-10 h-10 bg-rose-600 text-white rounded-full flex items-center justify-center hover:bg-rose-700 transition-colors shadow-lg">
                            <Camera size={20} />
                        </button>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{displayName}</h3>
                        <p className="text-stone-600 mb-4">{customer.email}</p>
                        <button
                            disabled
                            className="px-4 py-2 bg-stone-100 text-stone-400 rounded-lg cursor-not-allowed font-medium text-sm"
                        >
                            Upload New Photo (Coming Soon)
                        </button>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif font-bold text-gray-800">Personal Information</h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium text-sm"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    First Name
                                </div>
                            </label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                value={isEditing ? profileData.firstName : (customer.firstName || '-')}
                                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                className={`w-full px-4 py-3 border border-stone-300 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-rose-400 focus:border-rose-400' : 'bg-stone-50'
                                    }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    Last Name
                                </div>
                            </label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                value={isEditing ? profileData.lastName : (customer.lastName || '-')}
                                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                className={`w-full px-4 py-3 border border-stone-300 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-rose-400 focus:border-rose-400' : 'bg-stone-50'
                                    }`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            <div className="flex items-center gap-2">
                                <Mail size={16} />
                                Email Address
                            </div>
                        </label>
                        <input
                            type="email"
                            disabled
                            value={customer.email}
                            className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-stone-50 cursor-not-allowed"
                        />
                        <p className="text-xs text-stone-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            <div className="flex items-center gap-2">
                                <Phone size={16} />
                                Phone Number
                            </div>
                        </label>
                        <input
                            type="tel"
                            disabled={!isEditing}
                            value={isEditing ? profileData.phone : (customer.phone || '-')}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className={`w-full px-4 py-3 border border-stone-300 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-rose-400 focus:border-rose-400' : 'bg-stone-50'
                                }`}
                        />
                    </div>

                    {isEditing && (
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium flex items-center gap-2"
                            >
                                <Save size={20} />
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 bg-white border-2 border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
                            <Lock className="text-rose-600" size={24} />
                            Password & Security
                        </h2>
                        <p className="text-sm text-stone-600 mt-1">Keep your account secure</p>
                    </div>
                    {!showPasswordForm && (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium text-sm"
                        >
                            Change Password
                        </button>
                    )}
                </div>

                {showPasswordForm && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                required
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                required
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                                placeholder="Enter new password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                required
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                                placeholder="Confirm new password"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
                            >
                                Update Password
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="px-6 py-3 bg-white border-2 border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors font-medium"
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
