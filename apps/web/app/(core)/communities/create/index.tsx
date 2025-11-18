"use client";
import React, { useState, useTransition } from 'react';
import { ArrowLeft, Users, FileText, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { createCommunity } from './action';
import { useRouter } from 'next/navigation';

export default function CreateCommunityComponent({ universityId, userId }: { universityId: string, userId: string }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        universityId: universityId,
        userId: userId
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [pending, startTransition] = useTransition();

    const router = useRouter();

    const handleSubmit2 = async () => {
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/communities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    universityId: formData.universityId,
                    creator: formData.userId
                })
            });

            if (!response.ok) throw new Error('Failed to create community');

            setStatus({
                type: 'success',
                message: 'Community created successfully! Redirecting...'
            });

            setTimeout(() => {
                console.log('Redirect to /communities');
            }, 1500);
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Failed to create community. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });
        startTransition(async () => {
            try {

                const response = await createCommunity({
                    name: formData.name,
                    description: formData.description,
                    universityId: formData.universityId,
                    creator: formData.userId
                });

                if (!response.success) {
                    throw new Error(response.error || 'Failed to create community');
                }

                setStatus({
                    type: 'success',
                    message: 'Community created successfully! Redirecting...'
                });

                router.push('/communities');

            } catch (error) {
                console.log("error", error);
                setStatus({
                    type: 'error',
                    message: 'Failed to create community. Please try again.'
                });
            } finally {
                setIsSubmitting(false);
            }
        });
    }

    const handleChange = (name: any, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = formData.name.trim().length >= 3 && formData.description.trim().length >= 10;

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Header */}
            {/* <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => router.push('/communities')}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors font-medium cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Communities
                    </button>
                </div>
            </div> */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                <button
                    onClick={() => router.push('/communities')}
                    className="inline-flex items-center border border-indigo-300 px-3 py-1.5 rounded-md text-indigo-500 hover:bg-indigo-50 cursor-pointer transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18">
                        </path>
                    </svg>
                    <span className="ml-1 font-bold text-lg">Back</span>
                </button>
            </div>
            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Create Your Community
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Start building connections and bring together people who share your interests, goals, or passion.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <div className="space-y-8">
                            {/* Community Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <Users className="w-5 h-5 text-purple-600" />
                                    Community Name
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="e.g., Photography Club, Computer Science Students, Debate Society"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    maxLength={100}
                                />
                                <p className="text-sm text-gray-500">
                                    {formData.name.length}/100 characters
                                </p>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <FileText className="w-5 h-5 text-purple-600" />
                                    Description
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Describe what your community is about, who should join, and what activities or discussions you'll have..."
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                                    maxLength={500}
                                />
                                <p className="text-sm text-gray-500">
                                    {formData.description.length}/500 characters
                                </p>
                            </div>

                            {/* Guidelines */}
                            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                                    Community Guidelines
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 mt-0.5">•</span>
                                        <span>Choose a clear, descriptive name that represents your community</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 mt-0.5">•</span>
                                        <span>Write an engaging description to attract the right members</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 mt-0.5">•</span>
                                        <span>Be respectful and inclusive to foster a welcoming environment</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 mt-0.5">•</span>
                                        <span>Communities must comply with university policies and guidelines</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Status Messages */}
                            {status.message && (
                                <div className={`flex items-start gap-3 p-4 rounded-xl ${status.type === 'success'
                                    ? 'bg-green-50 border border-green-200 text-green-800'
                                    : 'bg-red-50 border border-red-200 text-red-800'
                                    }`}>
                                    {status.type === 'success' ? (
                                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    )}
                                    <p className="text-sm font-medium">{status.message}</p>
                                </div>
                            )}

                            {/* Submit Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={() => window.history.back()}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isFormValid || isSubmitting}
                                    className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-pink-600 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Create Community
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Footer */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>
                        Need help? Check out our{' '}
                        <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                            community guidelines
                        </a>{' '}
                        or{' '}
                        <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                            contact support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}