"use client"
import React, { useState, useTransition } from 'react';
import { Home, Bell, Search, Plus, Users, TrendingUp, Calendar, Briefcase, MessageSquare, Heart, Share2, Bookmark, MoreHorizontal, Image as ImageIcon, Video, BarChart3, X } from 'lucide-react';
import { createPost, sendImageToBackend } from './action';
import { CreatePostModal, PostCard } from './post';
import { redirect, RedirectType } from 'next/navigation';
import Image from 'next/image';

type NewPost = {
    content: string;
    type: 'TEXT' | 'IMAGE' | 'POLL';
    communityId: string;
    imageUrl?: string;
    poll?: {
        options: string[];
        duration: number;
    }
};


const ConnectifyDashboard = ({
    initialCommunities,
    posts,
    userInfo
}: {
    initialCommunities: any[];
    posts: any[];
    userInfo: any;
}) => {
    const [activeTab, setActiveTab] = useState('all');
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [newPost, setNewPost] = useState<NewPost>({ content: '', type: 'TEXT', communityId: '' });
    const [communities, setCommunities] = useState(initialCommunities);
    const [pending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, string[]>>({});


    const trendingTopics = [
        { tag: 'Hackathon2025', posts: 234 },
        { tag: 'PlacementDrive', posts: 189 },
        { tag: 'CulturalFest', posts: 156 },
        { tag: 'TechTalks', posts: 98 },
    ];

    async function handleCreatePost(postData?: NewPost) {
        startTransition(async () => {
            const res = await createPost(postData ?? newPost);

            if (res && typeof res === 'object' && !Array.isArray(res) && 'errors' in res) {
                const err = (res as any).errors;
                if (err && 'message' in err) {
                    setErrors({ general: (err as any).message });
                } else if (err) {
                    setErrors(err as Record<string, string[]>);
                }
            }

            setShowCreatePost(false);
        });
    }


    const handleImageUpload = (result: any) => {
        const uploadedUrl = result?.info?.secure_url;
        if (!uploadedUrl) return console.error("No URL returned from Cloudinary.");

        setNewPost((prev) => ({
            ...prev,
            type: 'IMAGE',
            imageUrl: uploadedUrl
        }));
    };

    const handleCommunityClick = (community: any) => {
        redirect(`/c/${community.id}`, RedirectType.push); // Navigate to the selected community
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">


            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Create Post Card */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl">
                                    {userInfo.profileImageUrl ? (
                                        <Image
                                            src={userInfo.profileImageUrl}
                                            alt={userInfo.name}
                                            width={1024}
                                            height={1024}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <span className="text-white font-semibold">
                                            {userInfo.name && userInfo.name
                                                .split(" ")
                                                .map((n: string) => n[0])
                                                .join("")
                                                .toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowCreatePost(true)}
                                    className="flex-1 text-left px-4 py-3 bg-neutral-100 dark:bg-neutral-700 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                                >
                                    What's on your mind?
                                </button>
                                <button
                                    onClick={() => setShowCreatePost(true)}
                                    className="p-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'all'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                All Posts
                            </button>
                            <button
                                onClick={() => setActiveTab('events')}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'events'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                Events
                            </button>
                            <button
                                onClick={() => setActiveTab('placements')}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'placements'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                Placements
                            </button>
                            <button
                                onClick={() => setActiveTab('clubs')}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'clubs'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                Clubs
                            </button>
                        </div>

                        {/* Posts */}
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Your Communities */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-neutral-800 dark:text-white">Your Communities</h3>
                                <button className="text-blue-500 text-sm font-medium hover:underline">See all</button>
                            </div>
                            <div className="space-y-3">
                                {communities.map((community) => (
                                    <div key={community.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer" onClick={() => handleCommunityClick(community)}>
                                        <div className={`w-10 h-10 ${community.color ?? "bg-blue-50"} rounded-lg flex items-center justify-center text-xl`}>
                                            {community.image ?? "🚀"}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-neutral-800 dark:text-white">{community.name}</p>
                                            <p className="text-xs text-neutral-500">{community._count.members} members</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trending Topics */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-orange-500" />
                                <h3 className="font-semibold text-neutral-800 dark:text-white">Trending Topics</h3>
                            </div>
                            <div className="space-y-3">
                                {trendingTopics.map((topic, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
                                        <div>
                                            <p className="font-medium text-sm text-neutral-800 dark:text-white">#{topic.tag}</p>
                                            <p className="text-xs text-neutral-500">{topic.posts} posts</p>
                                        </div>
                                        <span className="text-xs font-medium text-blue-500">{idx + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Post from Communities */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                            <h3 className="font-semibold text-neutral-800 dark:text-white mb-4">Top Post Today</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm">
                                        🚀
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-neutral-800 dark:text-white">Tech Club</p>
                                        <p className="text-xs text-neutral-500">2h ago</p>
                                    </div>
                                </div>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                    Join us for our Annual Hackathon 2025! Build innovative solutions...
                                </p>
                                <div className="flex items-center gap-4 text-xs text-neutral-500">
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-4 h-4" /> 234
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-4 h-4" /> 45
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-linear-to-br from-blue-500 to-purple-500 rounded-xl p-4 text-white">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-5 h-5" />
                                <h3 className="font-semibold">Upcoming Events</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                    <p className="font-medium text-sm">Hackathon 2025</p>
                                    <p className="text-xs opacity-90">Nov 20 • Tech Club</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                    <p className="font-medium text-sm">UI/UX Workshop</p>
                                    <p className="text-xs opacity-90">Nov 18 • Design Society</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Post Modal */}
            {showCreatePost && <CreatePostModal userInfo={userInfo} setNewPost={setNewPost} setShowCreatePost={setShowCreatePost} newPost={newPost} handleCreatePost={handleCreatePost} communities={communities} handleImageUpload={handleImageUpload} />}
        </div>
    );
};

export default ConnectifyDashboard;