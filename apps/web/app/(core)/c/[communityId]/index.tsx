"use client"
import React, { useState, useTransition } from 'react';
import { Users, Calendar, MapPin, Bell, Search, Plus, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, TrendingUp, Award, Briefcase } from 'lucide-react';
import { PostCard } from '../../dashboard/post';
import { checkMembership } from './action';
import { joinLeaveCommunity } from '../../communities/action';
import { useCreatePost } from '@/hooks/useCreatePost';
import { CreatePostModal } from '../../posts/CreatePostModal';

export default function CommunityPageComponent({ posts, community, mentions, isMember, creator, userInfo }: { posts: any, community: any, mentions: any, isMember: Boolean, creator: Boolean, userInfo: any }) {
    const [activeTab, setActiveTab] = useState('posts');
    const [isMemberState, setIsMemberState] = useState(isMember);
    const [isCreator, setIsCreator] = useState(creator);
    const [searchText, setSearchText] = useState("");
    const [postFilter, setPostFilter] = useState("all");

    const [pending, startTransition] = useTransition();
    const [error, setError] = useState("");



    const {
        showCreatePost,
        setShowCreatePost,
        newPost,
        setNewPost,
        handleCreatePost,
        handleImageUpload,
    } = useCreatePost();


    function handleJoinLeave(cID: string) {
        if (!cID) {
            throw new Error("Community not found");
        }
        startTransition(async () => {
            const res = await checkMembership(cID)
            if (res.isMember) {
                setIsMemberState(true)
            }
            else {
                try {
                    console.log("handling join leave for", cID, "currently joined:", isMemberState);
                    await joinLeaveCommunity(cID, !isMemberState);
                    setIsMemberState(!isMemberState);
                } catch (error) {
                    console.error("Error joining/leaving community:", error);
                }
            }

        })
    }


    // Define filter -> tags mapping
    const TAG_FILTERS: Record<string, string[]> = {
        all: [],
        announcement: ["announcement", "announcements"],
        placements: ["placement", "placements"],
    };


    const filteredPosts = posts.filter((post: any) => {
        const lowerSearch = searchText.toLowerCase();

        // ---- TAG FILTER ----
        const filterTags = TAG_FILTERS[postFilter];
        if (filterTags && filterTags.length > 0) {
            const postTags = post.tags?.map((t: string) => t.toLowerCase()) || [];
            const matchesTag = postTags.some((tag: string) => filterTags.includes(tag));
            if (!matchesTag) return false;
        }

        // ---- SEARCH FILTER ----
        if (searchText.trim() !== "") {
            const matchesContent = post.content?.toLowerCase().includes(lowerSearch);
            const matchesTags = post.tags?.some((tag: string) =>
                tag.toLowerCase().includes(lowerSearch)
            );
            return matchesContent || matchesTags;
        }

        return true;
    });



    const filteredMentions = mentions.filter((post: any) => {
        if (searchText.trim().length === 0) return true;

        const lowerSearch = searchText.toLowerCase();

        const matchesContent = post.content?.toLowerCase().includes(lowerSearch);
        const matchesTags = post.tags?.some((tag: string) =>
            tag.toLowerCase().includes(lowerSearch)
        );

        return matchesContent || matchesTags;
    });



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Community Header */}
            <div className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-500 text-white">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold">{community.name}</h1>
                                <Award className="w-6 h-6" />
                            </div>
                            <p className="text-lg text-blue-100 mb-4">{community.description}</p>
                            <div className="flex items-center gap-6 text-sm text-blue-100">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>{community._count.members.toLocaleString()} members</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>{posts.length} posts</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{community.universityId}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => { handleJoinLeave(community.id) }}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all ${isMemberState
                                    ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                                    : 'bg-white text-purple-600 hover:bg-gray-100'
                                    }`}
                            >
                                {isMemberState ? 'Joined' : 'Join Community'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'posts'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Posts
                        </button>
                        <button
                            onClick={() => setActiveTab('events')}
                            className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'events'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Events
                        </button>
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'members'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Members
                        </button>
                        <button
                            onClick={() => setActiveTab('mentions')}
                            className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'mentions'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Mentions
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">


                        {isCreator && (
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                        {userInfo.name?.split(" ").map((n: string) => n[0]).join("")}
                                    </div>
                                    <button
                                        onClick={() => setShowCreatePost(true)}
                                        className="flex-1 text-left px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100"
                                    >
                                        Share something with the community...
                                    </button>
                                    <button
                                        onClick={() => setShowCreatePost(true)}
                                        className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Filter Bar */}
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                {(activeTab === 'posts' || activeTab === 'mentions') && (
                                    <button
                                        onClick={() => setPostFilter("all")}
                                        className={`px-4 py-2 rounded-lg font-medium ${postFilter === "all" ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        All Posts
                                    </button>
                                )}

                                {activeTab === 'posts' && (
                                    <button
                                        onClick={() => setPostFilter("announcement")}
                                        className={`px-4 py-2 rounded-lg font-medium ${postFilter === "announcement" ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        Announcement
                                    </button>)}


                                {activeTab === 'posts' && (
                                    <button
                                        onClick={() => setPostFilter("placements")}
                                        className={`px-4 py-2 rounded-lg font-medium ${postFilter === "placements" ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        Placements
                                    </button>)}
                            </div>

                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search posts..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                                />

                            </div>
                        </div>

                        {/* Posts Feed */}
                        {
                            activeTab === 'posts' ? (
                                filteredPosts.length === 0 ?
                                    <p className="text-center text-gray-500 mt-12">No posts available in this community.</p>
                                    :
                                    filteredPosts.map((post: any) => (
                                        <PostCard key={post.id} post={post} userId={userInfo.id} />
                                    ))
                            ) : activeTab === 'mentions' ? (   // Mentions tab
                                mentions.length === 0 ?
                                    <p className="text-center text-gray-500 mt-12">No mentions found in this community.</p>
                                    :
                                    filteredMentions.length === 0 ? (
                                        <p className="text-center text-gray-500 mt-12">No mentions found.</p>
                                    ) : (
                                        filteredMentions.map((post: any) => (
                                            <PostCard key={post.id} post={post} userId={userInfo.id} />
                                        ))
                                    )
                            ) : (
                                <p className="text-center text-gray-500 mt-12">No data available for this tab.</p>
                            )
                        }
                    </div>
                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Info */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Quick Info</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Created</span>
                                    <span className="font-medium text-gray-900">{new Date(community.createdAt).toDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Category</span>
                                    <span className="font-medium text-gray-900">Technology</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Privacy</span>
                                    <span className="font-medium text-gray-900">Public</span>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Upcoming Events</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex flex-col items-center justify-center">
                                        <span className="text-xs text-blue-600 font-medium">DEC</span>
                                        <span className="text-lg font-bold text-blue-600">15</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-sm">Tech Fest 2025</p>
                                        <p className="text-xs text-gray-500">Main Auditorium</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex flex-col items-center justify-center">
                                        <span className="text-xs text-purple-600 font-medium">DEC</span>
                                        <span className="text-lg font-bold text-purple-600">20</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-sm">Web3 Workshop</p>
                                        <p className="text-xs text-gray-500">Lab Building</p>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors">
                                View All Events
                            </button>
                        </div>

                        {/* Top Contributors */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Top Contributors</h3>
                            <div className="space-y-3">
                                {['Rahul Krishna', 'Priya Nair', 'Arjun Menon'].map((name, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                            {name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm">{name}</p>
                                            <p className="text-xs text-gray-500">{15 - idx * 3} posts</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showCreatePost && (
                <CreatePostModal
                    userInfo={userInfo}
                    newPost={newPost}
                    setNewPost={setNewPost}
                    setShowCreatePost={setShowCreatePost}
                    handleCreatePost={handleCreatePost}
                    handleImageUpload={handleImageUpload}
                    communities={[community]}   // only this community
                    forceCommunityId={community.id} // fixed
                />
            )}

        </div>

    );
}