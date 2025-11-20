"use client"
import React, { useState, useTransition } from 'react';
import { User, Mail, University, Calendar, Edit2, Save, X, Camera, Check } from 'lucide-react';
import { updateUserDetails } from './action';
import { CldUploadButton } from 'next-cloudinary';

interface ConnectifyProfileProps {
    id: string;
    name: string;
    username: string;
    email: string;
    isEmailVerified: boolean;
    universityName: string;
    createdAt: string;
    profileImageUrl: string | null;

};

const ConnectifyProfile = ({ initialUserData }: { initialUserData: any }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [userData, setUserData] = useState(initialUserData);
    const [pending, startTransition] = useTransition();

    const [editForm, setEditForm] = useState({
        name: userData.name,
        profileImageUrl: userData.profileImageUrl as string | null
    });

    const handleEdit = () => {
        setIsEditing(true);
        setEditForm({
            name: userData.name,
            profileImageUrl: userData.profileImageUrl
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({
            name: userData.name,
            profileImageUrl: userData.profileImageUrl
        });
    };

    const handleSave = () => {
        // In real app, this would call your backend API
        setUserData({
            ...userData,
            name: editForm.name,
            profileImageUrl: editForm.profileImageUrl
        });
        setIsEditing(false);
        startTransition(() => {
            const res = updateUserDetails({
                name: editForm.name,
                profileImageUrl: editForm.profileImageUrl
            });

            if (!res) {
                console.error("Failed to update user details");
                return;
            }
            setUserData((prev: any) => ({
                ...prev,
                name: editForm.name,
                profileImageUrl: editForm.profileImageUrl
            }));
            setShowSuccess(true);




        });


        // setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleLogout = async () => {
        await fetch('http://localhost:3001/api/auth/logout', { method: 'POST', credentials: 'include' });
        window.location.href = '/login';
    };


    const handleImageUpload = (result: any) => {
        const uploadedUrl = result?.info?.secure_url;
        if (!uploadedUrl) return console.error("No URL returned from Cloudinary.");

        setEditForm((prev) => ({
            ...prev,
            profileImageUrl: uploadedUrl
        }));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-pulse">
                        <Check className="w-5 h-5 text-green-600" />
                        <p className="text-green-800 font-medium">Profile updated successfully!</p>
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-600"></div>

                    {/* Profile Content */}
                    <div className="relative px-6 pb-6">
                        {/* Profile Image */}
                        <div className="absolute -top-16 left-6">
                            <div className="relative">
                                {editForm.profileImageUrl ? (
                                    <img
                                        src={editForm.profileImageUrl}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full border-4 border-white object-cover bg-gray-100"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full border-4 border-white bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                                        <User className="w-16 h-16 text-white" />
                                    </div>
                                )}

                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                                        <Camera className="w-5 h-5 text-white" />
                                        <CldUploadButton
                                            className='hidden'
                                            uploadPreset='connectify_preset'
                                            onSuccess={handleImageUpload}
                                            options={{ maxFiles: 1 }}
                                        >
                                            Images
                                        </CldUploadButton>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Edit Button */}
                        <div className="pt-20 flex justify-end">
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Profile Information */}
                        <div className="mt-6 space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Enter your full name"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900 font-medium">{userData.name || 'Not set'}</span>
                                    </div>
                                )}
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Username
                                </label>

                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-900 font-medium">@{userData.username}</span>
                                </div>

                            </div>

                            {/* Email - Not Editable */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Email Address
                                </label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-900">{userData.email}</span>
                                    {userData.isEmailVerified && (
                                        <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                            Verified
                                        </span>
                                    )}
                                </div>
                                {!isEditing && (
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                )}
                            </div>

                            {/* University - Not Editable */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    University
                                </label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                                    <University className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-900">{userData.universityName}</span>
                                </div>
                            </div>

                            {/* Member Since */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Member Since
                                </label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-900">{formatDate(userData.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Account Settings Section */}
                        {!isEditing && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                                <div className="space-y-3">
                                    <button className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                        <span className="text-gray-700 font-medium">Change Password</span>
                                    </button>
                                    <button className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                        <span className="text-gray-700 font-medium">Email Preferences</span>
                                    </button>
                                    <button className="w-full px-4 py-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors" onClick={handleLogout}>
                                        <span className="text-red-600 font-medium">Delete Account</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectifyProfile;