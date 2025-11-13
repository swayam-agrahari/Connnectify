'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { GlassCard } from '@repo/ui/glass-card';
import { GlassInput } from '@repo/ui/glass-input';
import { GlassButton } from '@repo/ui/glass-button';
import { type LoginInput } from '@/lib/validations/auth';
import { BRAND } from '@/lib/constants';
import { loginAction } from './action';

export default function LoginPage() {
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [pending, startTransition] = useTransition();

    const [formdata, setFormdata] = useState<LoginInput>({
        email: '',
        password: '',
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const formdata = new FormData(e.currentTarget as HTMLFormElement);

        startTransition(async () => {
            const result = await loginAction(formdata);
            console.log("in jhere", result)
            if (result?.errors) {
                if ('message' in result.errors) {
                    setErrors({ error: result.errors.message });
                } else {
                    setErrors(result.errors);
                }
                console.log(errors);
            }

        });
    }



    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-neutral-800 dark:bg-white mb-4">
                        <Sparkles className="w-8 h-8 text-white dark:text-neutral-800" />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
                        {BRAND.name}
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        {BRAND.tagline}
                    </p>
                </div>

                <GlassCard>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-2">
                            Welcome back
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Email
                            </label>
                            <GlassInput
                                type="email"
                                placeholder="you@university.edu"
                                icon={Mail}
                                value={formdata.email}
                                onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
                                name='email'
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Password
                            </label>
                            <GlassInput
                                type="password"
                                placeholder="Enter your password"
                                icon={Lock}
                                value={formdata.password}
                                onChange={(e) => setFormdata({ ...formdata, password: e.target.value })}
                                name='password'
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <GlassButton
                            type="submit"
                            variant="primary"
                            isLoading={pending}
                            className="w-full"
                        >
                            Sign in
                        </GlassButton>
                        {errors.error && (
                            <p className="text-sm text-red-600 dark:text-red-400 text-center">
                                {errors.error}
                            </p>
                        )}

                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                            Don't have an account?{' '}
                            <Link
                                href="/register"
                                className="font-medium text-neutral-800 dark:text-white hover:underline"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
