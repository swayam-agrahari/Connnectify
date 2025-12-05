"use client";
import { Bell, Calendar, HomeIcon, Search, Users } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


export default function NavBar({ users, communities, allUsers }: { users: any, communities: any, allUsers: any }) {


    const router = useRouter();
    const pathname = usePathname();

    const getActiveFromPath = (path: string) => {
        if (path.startsWith("/communities")) return "communities";
        if (path.startsWith("/events")) return "events";
        if (path.startsWith("/profile")) return "profile";
        return "home"; // default
    };

    const [active, setActive] = useState(getActiveFromPath(pathname));

    useEffect(() => {
        setActive(getActiveFromPath(pathname));
    }, [pathname]);

    const [query, setQuery] = useState("");
    const [openSearch, setOpenSearch] = useState(false);

    const filteredUsers = allUsers.filter((u: any) =>
        u.name.toLowerCase().includes(query.toLowerCase())
    );

    const filteredCommunities = communities.communities.filter((c: any) =>
        c.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelectUser = (id: string) => {

        console.log("Selected user ID:", id);
        router.push(`/profile/${id}`);
        setOpenSearch(false);
        setQuery("");
    };

    const handleSelectCommunity = (id: string) => {
        router.push(`/c/${id}`);
        setOpenSearch(false);
        setQuery("");
    };


    const handleClickHome = () => {
        setActive('home');
        router.push('/dashboard');
    };

    const handleClickCommunities = () => {
        setActive('communities');
        router.push('/communities');
    };

    const handleClickProfile = (userId: string) => {
        setActive('profile');
        router.push(`/profile/${userId}`);
    }

    const handleClickEvents = () => {
        setActive('events');
        router.push('/events');
    }
    return (
        <nav className="sticky top-0 z-40 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shadow-sm" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={handleClickHome}>
                            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center" >
                                <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <span className="text-xl font-bold bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent" >
                                Connectify
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-1">
                            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${active === 'home' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors'}`} onClick={handleClickHome}>
                                <HomeIcon className="w-5 h-5" />
                                <span>Home</span>
                            </button>
                            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${active === 'communities' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors'}`} onClick={handleClickCommunities}>
                                <Users className="w-5 h-5" />
                                <span>Communities</span>
                            </button>
                            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${active === 'events' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors'}`} onClick={() => handleClickEvents()}>
                                <Calendar className="w-5 h-5" />
                                <span>Events</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="hidden sm:flex items-center bg-neutral-100 dark:bg-neutral-700 rounded-lg px-4 py-2 w-64 relative">
                            <Search className="w-5 h-5 text-neutral-400" />

                            <input
                                type="text"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setOpenSearch(e.target.value.length > 0);
                                }}
                                className="ml-2 bg-transparent border-none outline-none w-full text-sm text-neutral-800 dark:text-white"
                            />

                            {/* SEARCH MODAL */}
                            {openSearch && (
                                <div className="absolute top-12 left-0 w-full bg-white dark:bg-neutral-800 
                        shadow-xl rounded-xl border border-neutral-200 
                        dark:border-neutral-700 max-h-80 overflow-y-auto z-50">

                                    {/* USERS SECTION */}
                                    {filteredUsers.length > 0 && (
                                        <div>
                                            <p className="px-4 py-2 text-xs text-neutral-500">Users</p>
                                            {filteredUsers.map((user: any) => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => handleSelectUser(user.id)}
                                                    className="flex items-center gap-3 px-4 py-2 
                                       hover:bg-neutral-100 dark:hover:bg-neutral-700 
                                       cursor-pointer transition-all"
                                                >
                                                    <Image
                                                        src={user.profileImageUrl ? user.profileImageUrl : '/avatar.jpg'}
                                                        alt={user.name}
                                                        width={40}
                                                        height={40}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <p className="text-sm">{user.name}</p>
                                                        <p className="text-xs text-neutral-500">@{user.username}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* COMMUNITIES SECTION */}
                                    {filteredCommunities.length > 0 && (
                                        <div className="mt-2">
                                            <p className="px-4 py-2 text-xs text-neutral-500">Communities</p>
                                            {filteredCommunities.map((comm: any) => (
                                                <div
                                                    key={comm.id}
                                                    onClick={() => handleSelectCommunity(comm.id)}
                                                    className="flex items-center gap-3 px-4 py-2 
                                       hover:bg-neutral-100 dark:hover:bg-neutral-700 
                                       cursor-pointer transition-all"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-linear-to-br 
                                            from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm">
                                                        {comm.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm">{comm.name}</p>
                                                        <p className="text-xs text-neutral-500">{comm.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* NO RESULTS */}
                                    {filteredUsers.length === 0 && filteredCommunities.length === 0 && (
                                        <p className="px-4 py-4 text-center text-sm text-neutral-500">
                                            No results found
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <button className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 relative">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer" onClick={() => handleClickProfile(users.id)}>
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl">

                                <Image
                                    src={users.profileImageUrl ? users.profileImageUrl : '/avatar.jpg'}
                                    alt={users.name}
                                    width={1024}
                                    height={1024}
                                    className="rounded-full object-cover w-10 h-10 "
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}