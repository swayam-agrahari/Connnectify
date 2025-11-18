"use client";
import { Bell, Calendar, HomeIcon, Search, Users } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function NavBar({ user }: { user: any }) {
    const handleClick = () => {
        redirect('/dashboard');
    };

    const handleClick2 = () => {
        redirect('/communities');
    };

    const handleClick3 = () => {
        redirect('/profile');
    }
    return (
        <nav className="sticky top-0 z-40 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shadow-sm" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={handleClick}>
                            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center" >
                                <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <span className="text-xl font-bold bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                Connectify
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-1">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium" onClick={handleClick}>
                                <HomeIcon className="w-5 h-5" />
                                <span>Home</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" onClick={handleClick2}>
                                <Users className="w-5 h-5" />
                                <span>Communities</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                                <Calendar className="w-5 h-5" />
                                <span>Events</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center bg-neutral-100 dark:bg-neutral-700 rounded-lg px-4 py-2 w-64">
                            <Search className="w-5 h-5 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="ml-2 bg-transparent border-none outline-none w-full text-sm text-neutral-800 dark:text-white"
                            />
                        </div>

                        <button className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 relative">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer" onClick={handleClick3}>
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl">
                                {user.profileImageUrl ? (
                                    <Image
                                        src={user.profileImageUrl}
                                        alt={user.name}
                                        width={1024}
                                        height={1024}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <span className="text-white font-semibold">
                                        {user.name && user.name
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}