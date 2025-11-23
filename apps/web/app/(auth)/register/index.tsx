'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, GraduationCap, Sparkles } from 'lucide-react';
import { GlassCard } from '@repo/ui/glass-card';
import { GlassInput } from '@repo/ui/glass-input';
import { GlassButton } from '@repo/ui/glass-button';
import { GlassSelect } from '@repo/ui/glass-select';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { BRAND } from '@/lib/constants';
import { registerAction } from './action';

interface University {
    id: string;
    name: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [universities, setUniversities] = useState<University[]>([]);
    const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);

    const [formdata, setFormdata] = useState<RegisterInput>({
        username: '',
        email: '',
        password: '',
        universityId: '',
    });
    const [pending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const collegeEmailRegex = /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+edu$/;


    const validateEmail = (email: string) => {
        // If input is empty → no error
        if (!email.trim()) {
            setErrors(prev => ({ ...prev, email: [] }));
            return;
        }

        // If invalid college email → show error
        if (!collegeEmailRegex.test(email)) {
            setErrors(prev => ({
                ...prev,
                email: ["Please use a valid college/university email"],
            }));
        } else {
            // Valid email → clear error
            setErrors(prev => ({ ...prev, email: [] }));
        }
    };

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await fetch('/api/universities');
                const data = await response.json();
                setUniversities(data);
            } catch (error) {
                console.error('Error fetching universities:', error);
            } finally {
                setIsLoadingUniversities(false);
            }
        };

        fetchUniversities();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!collegeEmailRegex.test(formdata.email)) {
            setErrors(prev => ({
                ...prev,
                email: ["Please use a valid college/university email"],
            }));
            return;
        }

        setIsLoading(true);

        const data = new FormData(e.currentTarget as HTMLFormElement);

        startTransition(async () => {
            const res = await registerAction(data);

            if (res?.errors) {
                if ('message' in res.errors) {
                    setErrors({ general: res.errors.message });
                } else {
                    setErrors(res.errors);
                }
            }
            setIsLoading(false);
        });
    }


    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
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
                            Create an account
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                            Join your campus community today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Username
                            </label>
                            <GlassInput
                                type="text"
                                placeholder="johndoe"
                                icon={User}
                                value={formdata.username}
                                onChange={(e) => setFormdata({ ...formdata, username: e.target.value })}
                                name='username'
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Email
                            </label>
                            <GlassInput
                                type="email"
                                placeholder="you@university.edu"
                                icon={Mail}
                                value={formdata.email}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormdata({ ...formdata, email: value });
                                    if (!value.trim()) {
                                        setErrors(prev => ({ ...prev, email: [] }));
                                    }
                                }}
                                onBlur={(e) => validateEmail(e.target.value)}
                                name="email"
                            />
                            {errors.email && errors.email.length > 0 && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email[0]}
                                </p>
                            )}

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Password
                            </label>
                            <GlassInput
                                type="password"
                                placeholder="Create a strong password"
                                icon={Lock}
                                value={formdata.password}
                                onChange={(e) => setFormdata({ ...formdata, password: e.target.value })}
                                name='password'
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                University
                            </label>
                            <div className="relative">
                                {isLoadingUniversities ? (
                                    <div className="flex h-12 w-full rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3 items-center">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                                            <span className="text-sm text-neutral-400">Loading universities...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 z-10" />
                                        <GlassSelect
                                            value={formdata.universityId}
                                            onChange={(e) => setFormdata({ ...formdata, universityId: e.target.value })}
                                            name='universityId'
                                        >
                                            <option value="">Select your university</option>
                                            {universities.map((uni) => (
                                                <option key={uni.id} value={uni.id}>
                                                    {uni.name}
                                                </option>
                                            ))}
                                        </GlassSelect>
                                    </div>
                                )}
                            </div>
                        </div>

                        <GlassButton
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                            disabled={isLoadingUniversities}
                            className="w-full"
                        >
                            Create account
                        </GlassButton>
                        {errors.code && (
                            <p className="text-sm text-red-600 dark:text-red-400 text-center">
                                {errors.code}
                            </p>
                        )}
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-medium text-neutral-800 dark:text-white hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
