'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Mail, Lock, Sparkles, KeyRound } from 'lucide-react'; // Added KeyRound
import { GlassCard } from '@repo/ui/glass-card';
import { GlassInput } from '@repo/ui/glass-input';
import { GlassButton } from '@repo/ui/glass-button';
import { BRAND } from '@/lib/constants';
import { requestOtpAction, resetPasswordWithOtpAction } from './action';


// Your interface was good, but 'code' is usually a string
interface ForgetPass {
    email: string;
    resetPassword: string;
    code: string;
}

export default function ForgetPasswordPage() {
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [pending, startTransition] = useTransition();

    // This state will track all your form data
    const [formdata, setFormdata] = useState<ForgetPass>({
        email: '',
        resetPassword: '',
        code: '',
    });

    // --- THIS IS THE FIX ---
    // This new state will track which form to show
    const [isOtpSent, setIsOtpSent] = useState(false);

    // This function handles the FIRST form (Send OTP)
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({}); // Clear old errors

        const formDataObj = new FormData(e.currentTarget as HTMLFormElement);

        startTransition(async () => {
            const result = await requestOtpAction(formDataObj);
            if (result?.errors) {
                setErrors(result.errors);
            } else {
                // SUCCESS! Show the next form.
                setIsOtpSent(true);
            }
        });
    }

    // This function handles the SECOND form (Reset Password)
    async function handleSubmit1(e: React.FormEvent) {
        e.preventDefault();
        setErrors({}); // Clear old errors

        const formDataObj = new FormData(e.currentTarget as HTMLFormElement);

        startTransition(async () => {
            const result = await resetPasswordWithOtpAction(formDataObj);
            if (result?.errors) {
                setErrors(result.errors);
            } else {
                // SUCCESS! Redirect to login
                // (The action file will handle the redirect)
            }
        });
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    {/* ... Brand Logo ... */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-neutral-800 dark:bg-white mb-4">
                        <Sparkles className="w-8 h-8 text-white dark:text-neutral-800" />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">{BRAND.name}</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">{BRAND.tagline}</p>
                </div>

                <GlassCard>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-2">
                            Reset Password
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                            {/* Title changes based on the step */}
                            {isOtpSent
                                ? "Enter your code and new password"
                                : "Enter your email for verification"
                            }
                        </p>
                    </div>

                    {/* --- CONDITIONAL RENDERING --- */}
                    {/* If OTP is NOT sent, show Form 1. Otherwise, show Form 2. */}

                    {!isOtpSent ? (
                        // --- FORM 1: SEND OTP ---
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email</label>
                                <GlassInput
                                    type="email"
                                    placeholder="you@university.edu"
                                    icon={Mail}
                                    value={formdata.email}
                                    onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
                                    name='email'
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600 dark:text-red-400 text-center mt-2">{errors.email[0]}</p>
                                )}
                            </div>

                            <GlassButton
                                type="submit"
                                variant="primary"
                                isLoading={pending}
                                className="w-full"
                            >
                                Send OTP
                            </GlassButton>
                            {errors.general && (
                                <p className="text-sm text-red-600 dark:text-red-400 text-center">{errors.general[0]}</p>
                            )}
                        </form>
                    ) : (
                        // --- FORM 2: RESET PASSWORD ---
                        <form onSubmit={handleSubmit1} className="space-y-5">
                            <input type="hidden" name="email" value={formdata.email} />
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email</label>
                                <GlassInput
                                    type="email"
                                    placeholder={formdata.email}
                                    icon={Mail}
                                    value={formdata.email} // Show email from step 1
                                    name='email'
                                    disabled // Make it read-only
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Verification Code (OTP)</label>
                                <GlassInput
                                    type="text"
                                    placeholder="123456"
                                    icon={KeyRound}
                                    maxLength={6}
                                    value={formdata.code}
                                    onChange={(e) => setFormdata({ ...formdata, code: e.target.value })}
                                    name='code'
                                    required
                                />
                                {errors.code && (
                                    <p className="text-sm text-red-600 dark:text-red-400 text-center mt-2">{errors.code[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">New Password</label>
                                <GlassInput
                                    type="password"
                                    placeholder="Enter your new password"
                                    icon={Lock}
                                    value={formdata.resetPassword}
                                    // --- FIX: Use 'resetPassword' to update state ---
                                    onChange={(e) => setFormdata({ ...formdata, resetPassword: e.target.value })}
                                    // --- FIX: Name this 'newPassword' for the action ---
                                    name='newPassword'
                                    required
                                />
                                {errors.newPassword && (
                                    <p className="text-sm text-red-600 dark:text-red-400 text-center mt-2">{errors.newPassword[0]}</p>
                                )}
                            </div>

                            <GlassButton
                                type="submit"
                                variant="primary"
                                isLoading={pending}
                                className="w-full"
                            >
                                Verify & Reset Password
                            </GlassButton>
                            {errors.general && (
                                <p className="text-sm text-red-600 dark:text-red-400 text-center">{errors.general[0]}</p>
                            )}
                        </form>
                    )}

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                            <Link
                                href="/login"
                                className="font-medium text-neutral-800 dark:text-white hover:underline"
                            >
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}