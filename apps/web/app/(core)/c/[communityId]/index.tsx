"use client"
import React, { useState, useTransition } from 'react';
import { Users, Calendar, MapPin, Bell, Search, Plus, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, TrendingUp, Award, Briefcase } from 'lucide-react';
import { PostCard } from '../../dashboard/post';
import { checkMembership } from './action';
import { joinLeaveCommunity } from '../../communities/action';

export default function CommunityPageComponent({ posts, community, isMember, creator }: { posts: any, community: any, isMember: Boolean, creator: Boolean }) {
    const [activeTab, setActiveTab] = useState('posts');
    const [isMemberState, setIsMemberState] = useState(isMember);
    const [isCreator, setIsCreator] = useState(creator);
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState("");

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



    // // Mock community data
    // const community = {
    //     id: "1",
    //     name: "tech-club",
    //     displayName: "Tech Club",
    //     description: "Official community for technology enthusiasts. Stay updated with hackathons, workshops, and tech talks.",
    //     university: "Kerala University",
    //     memberCount: 1247,
    //     postCount: 89,
    //     createdAt: "2024-01-15"
    // };

    // // Mock posts data
    // const [posts, setPosts] = useState([
    //     {
    //         id: "1",
    //         type: "event",
    //         author: {
    //             name: "Rahul Krishna",
    //             avatar: "RK",
    //             role: "Club President"
    //         },
    //         timestamp: "2 hours ago",
    //         title: "Annual Tech Fest 2025 - Registration Open!",
    //         content: "We're excited to announce our biggest tech fest yet! Join us for 3 days of hackathons, workshops, and networking. Early bird registration ends this Friday.",
    //         event: {
    //             date: "Dec 15-17, 2024",
    //             location: "Main Auditorium",
    //             registered: 234
    //         },
    //         likes: 156,
    //         liked: false,
    //         comments: 23,
    //         shares: 45,
    //         tags: ["Event", "Hackathon"]
    //     },
    //     {
    //         id: "2",
    //         type: "placement",
    //         author: {
    //             name: "Placement Cell",
    //             avatar: "PC",
    //             role: "Official"
    //         },
    //         timestamp: "5 hours ago",
    //         title: "Google is hiring for SDE roles!",
    //         content: "Google is conducting campus placements next month. Eligibility: 7+ CGPA, No backlogs. Application deadline: Nov 20th. Register through the placement portal.",
    //         placement: {
    //             company: "Google",
    //             role: "Software Development Engineer",
    //             ctc: "₹24 LPA"
    //         },
    //         likes: 342,
    //         liked: false,
    //         comments: 67,
    //         shares: 89,
    //         tags: ["Placement", "Urgent"]
    //     },
    //     {
    //         id: "3",
    //         type: "announcement",
    //         author: {
    //             name: "Priya Nair",
    //             avatar: "PN",
    //             role: "Core Team"
    //         },
    //         timestamp: "1 day ago",
    //         title: "Workshop: Introduction to Web3 & Blockchain",
    //         content: "Free workshop this Saturday! Learn about blockchain technology, smart contracts, and how to build your first dApp. Limited seats available, register now!",
    //         likes: 98,
    //         liked: false,
    //         comments: 12,
    //         shares: 34,
    //         tags: ["Workshop", "Web3"]
    //     }
    // ]);

    // const toggleLike = ({ postId }: { postId: string }) => {
    //     setPosts(posts.map(post =>
    //         post.id === postId
    //             ? { ...post, likes: post.likes + (post.liked ? -1 : 1), liked: !post.liked }
    //             : post
    //     ));
    // };

    // const PostCard = ({ post }: any) => (
    //     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
    //         <div className="p-6">
    //             {/* Post Header */}
    //             <div className="flex items-start justify-between mb-4">
    //                 <div className="flex items-center gap-3">
    //                     <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
    //                         {post.author.avatar}
    //                     </div>
    //                     <div>
    //                         <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
    //                         <p className="text-sm text-gray-500">{post.author.role} • {post.timestamp}</p>
    //                     </div>
    //                 </div>
    //                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
    //                     <MoreHorizontal className="w-5 h-5 text-gray-400" />
    //                 </button>
    //             </div>

    //             {/* Post Content */}
    //             <div className="mb-4">
    //                 <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
    //                 <p className="text-gray-700 leading-relaxed">{post.content}</p>
    //             </div>

    //             {/* Event/Placement Card */}
    //             {post.event && (
    //                 <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 border border-blue-200">
    //                     <div className="flex items-center gap-4 text-sm">
    //                         <div className="flex items-center gap-2 text-gray-700">
    //                             <Calendar className="w-4 h-4" />
    //                             <span>{post.event.date}</span>
    //                         </div>
    //                         <div className="flex items-center gap-2 text-gray-700">
    //                             <MapPin className="w-4 h-4" />
    //                             <span>{post.event.location}</span>
    //                         </div>
    //                         <div className="flex items-center gap-2 text-blue-600 ml-auto font-semibold">
    //                             <Users className="w-4 h-4" />
    //                             <span>{post.event.registered} registered</span>
    //                         </div>
    //                     </div>
    //                 </div>
    //             )}

    //             {post.placement && (
    //                 <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
    //                     <div className="flex items-center justify-between">
    //                         <div>
    //                             <p className="font-semibold text-gray-900">{post.placement.company}</p>
    //                             <p className="text-sm text-gray-600">{post.placement.role}</p>
    //                         </div>
    //                         <div className="text-right">
    //                             <p className="text-sm text-gray-600">Package</p>
    //                             <p className="text-lg font-bold text-green-600">{post.placement.ctc}</p>
    //                         </div>
    //                     </div>
    //                 </div>
    //             )}

    //             {/* Tags */}
    //             {post.tags && <div className="flex gap-2 mb-4">
    //                 {post.tags.map(({ tag, idx }: any) => {
    //                     // Make sure both `tag` and `idx` are valid before using them as keys
    //                     if (tag && idx !== undefined) {
    //                         return (
    //                             <span
    //                                 key={`${tag}-${idx}`} // Ensure unique key
    //                                 className={`px-3 py-1 rounded-full text-xs font-medium ${tag === 'Urgent'
    //                                     ? 'bg-red-100 text-red-700'
    //                                     : tag === 'Placement'
    //                                         ? 'bg-green-100 text-green-700'
    //                                         : 'bg-blue-100 text-blue-700'
    //                                     }`}
    //                             >
    //                                 {tag}
    //                             </span>
    //                         );
    //                     } else {
    //                         // Optionally return null or a fallback component if `tag` or `idx` are invalid
    //                         return null;
    //                     }
    //                 })}
    //             </div>}


    //             {/* Post Actions */}
    //             <div className="flex items-center justify-between pt-4 border-t border-gray-200">
    //                 <button
    //                     onClick={() => toggleLike(post.id)}
    //                     className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${post.liked
    //                         ? 'text-red-500 bg-red-50'
    //                         : 'text-gray-600 hover:bg-gray-100'
    //                         }`}
    //                 >
    //                     <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
    //                     <span className="font-medium">{post.likes}</span>
    //                 </button>
    //                 <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
    //                     <MessageCircle className="w-5 h-5" />
    //                     <span className="font-medium">{post.comments}</span>
    //                 </button>
    //                 <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
    //                     <Share2 className="w-5 h-5" />
    //                     <span className="font-medium">{post.shares}</span>
    //                 </button>
    //                 <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
    //                     <Bookmark className="w-5 h-5" />
    //                 </button>
    //             </div>
    //         </div>
    //     </div>
    // );

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
                            onClick={() => setActiveTab('about')}
                            className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'about'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            About
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Create Post Card */}
                        {isCreator && (
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                        YU
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Share something with the community..."
                                            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <div className="flex items-center gap-2 mt-3">
                                            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2">
                                                <Plus className="w-4 h-4" />
                                                Post
                                            </button>
                                            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                                                Event
                                            </button>
                                            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                                                Announcement
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Filter Bar */}
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium">
                                    All Posts
                                </button>
                                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
                                    Events
                                </button>
                                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
                                    Placements
                                </button>
                            </div>
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search posts..."
                                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                                />
                            </div>
                        </div>

                        {/* Posts Feed */}
                        {posts.length === 0 ? (
                            <p className="text-center text-gray-500 mt-12">No posts available in this community.</p>
                        ) : (
                            posts.map((post: any) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        )}
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
        </div>
    );
}