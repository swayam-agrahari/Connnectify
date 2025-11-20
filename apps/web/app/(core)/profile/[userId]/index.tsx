"use client";
import React, { useState } from 'react';
import { Settings, LogOut, Edit3, MapPin, Calendar, Mail, Users, Heart, MessageCircle, Share2, Bookmark, Grid, List, MoreHorizontal } from 'lucide-react';
import { mock } from 'node:test';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/(auth)/login/action';
import { timeAgo } from '@/lib/utils';


const mockPosts = [
    {
        id: '1',
        content: 'Just finished an amazing AI workshop! The future of machine learning is incredibly exciting. Thanks to the CS Club for organizing this! 🤖✨',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
        likes: 145,
        comments: 23,
        timestamp: '2025-11-18T14:30:00',
        community: 'Computer Science Club',
        isLiked: true
    },
    {
        id: '2',
        content: 'Beautiful sunset from campus today! Sometimes you need to step away from the screen and appreciate the moment 🌅',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        likes: 289,
        comments: 34,
        timestamp: '2025-11-17T18:45:00',
        community: 'Photography Club',
        isLiked: false
    },
    {
        id: '3',
        content: 'Working on my thesis project - building an AI-powered study assistant for students. Excited to share the progress soon! 💻📚',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
        likes: 198,
        comments: 45,
        timestamp: '2025-11-16T10:20:00',
        community: 'Tech Innovators',
        isLiked: true
    },
    {
        id: '4',
        content: 'Coffee and code - the perfect combination for a productive study session ☕️💻',
        imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600',
        likes: 167,
        comments: 18,
        timestamp: '2025-11-15T09:15:00',
        community: 'Student Life',
        isLiked: false
    },
    {
        id: '5',
        content: 'Hackathon prep is in full swing! Our team is building something amazing. Stay tuned! 🚀',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600',
        likes: 223,
        comments: 38,
        timestamp: '2025-11-14T16:00:00',
        community: 'Tech Innovators',
        isLiked: true
    },
    {
        id: '6',
        content: 'Attended an inspiring talk on mental health today. Remember to take care of yourselves! 💚',
        imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600',
        likes: 312,
        comments: 52,
        timestamp: '2025-11-13T15:30:00',
        community: 'Student Wellness',
        isLiked: true
    }
];

export default function ProfilePage({ initialUserData, initialPosts, userId, myUser }: { initialUserData: any, initialPosts: any, userId: string, myUser: any }) {
    const [user] = useState(initialUserData);
    const [posts, setPosts] = useState(initialPosts);
    const [viewMode, setViewMode] = useState('grid');
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const isCurrentUser = myUser.id === userId;
    console.log("isCurrent", isCurrentUser);

    const router = useRouter();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    };

    const formatPostDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const toggleLike = (postId: string) => {
        setPosts(posts.map((post: any) => {
            if (post.id === postId) {
                return {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1
                };
            }
            return post;
        }));
    };

    const handleLogout = async () => {
        await logoutAction();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Cover Image */}
            <div className="relative h-64 bg-linear-to-r from-purple-500 to-pink-500">
                <Image
                    src={user.coverUrl ? user.coverUrl : 'https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200'}
                    alt="Cover"
                    width={1080}
                    height={256}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            </div>

            {/* Profile Info Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative">
                    {/* Avatar */}
                    <div className="absolute -top-20 left-0">
                        <div className="relative">
                            <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
                            />
                            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 pb-6">
                        {isCurrentUser && <div className='flex justify-end gap-3'>
                            <button
                                onClick={() => router.push(`/profile/${user.id}/edit-profile`)}
                                className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center gap-2 shadow-sm"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </button>

                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="p-2.5 bg-red-50 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>

                        </div>}
                    </div>

                    {/* User Info */}
                    <div className={`pb-6 border-b border-gray-200 ${isCurrentUser ? "mt-4" : "mt-12"}`}>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                            {user.name}
                        </h1>
                        <p className="text-gray-600 mb-4">{user.username}</p>

                        <p className="text-gray-700 mb-4 whitespace-pre-line max-w-2xl">
                            {user.bio}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {user.location === "9" ? "Amrita Vishwa Vidyapeetham" : user.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                Joined {formatDate(user.joinedDate)}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{user.stats.posts}</div>
                                <div className="text-sm text-gray-600">Posts</div>
                            </div>
                            <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="text-2xl font-bold text-gray-900">{user.stats.communities}</div>
                                <div className="text-sm text-gray-600">Communities</div>
                            </div>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center justify-between py-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">My Posts</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                    ? 'bg-purple-100 text-purple-600'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                    ? 'bg-purple-100 text-purple-600'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Posts Grid/List */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
                            {posts.map((post: any) => (
                                <div key={post.id} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-200">
                                    <img
                                        src={post.imageUrl ? post.imageUrl : '/image.jpg'}
                                        alt={post.content}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100">
                                        <div className="flex items-center gap-2 text-white font-semibold">
                                            <Heart className="w-6 h-6 fill-white" />
                                            {post.votes.length}
                                        </div>
                                        <div className="flex items-center gap-2 text-white font-semibold">
                                            <MessageCircle className="w-6 h-6 fill-white" />
                                            {post.comments.length}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6 py-6">
                            {posts.map((post: any) => (
                                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Post Header */}
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.avatarUrl}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {timeAgo(new Date(post.createdAt))}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                            <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>

                                    {/* Post Content */}
                                    <p className="px-4 pb-3 text-gray-800">{post.content}</p>

                                    {/* Post Image */}
                                    <img
                                        src={post.imageUrl ? post.imageUrl : '/image.jpg'}
                                        alt={post.content}
                                        className="w-full max-h-96 object-cover"
                                    />

                                    {/* Post Actions */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => toggleLike(post.id)}
                                                    className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
                                                >
                                                    <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                                    <span className="font-medium">{post.votes.length}</span>
                                                </button>
                                                <button className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors">
                                                    <MessageCircle className="w-6 h-6" />
                                                    <span className="font-medium">{post.comments.length}</span>
                                                </button>
                                                <button className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors">
                                                    <Share2 className="w-6 h-6" />
                                                </button>
                                            </div>
                                            <button className="text-gray-700 hover:text-purple-600 transition-colors">
                                                <Bookmark className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Logout</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}