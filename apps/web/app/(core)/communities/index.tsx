"use client";
import React, { useState, useTransition } from 'react';
import { Users, Search, Filter, TrendingUp, Star, CheckCircle, Plus, Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { joinLeaveCommunity } from './action';
import { redirect, useRouter } from 'next/navigation';


export default function CommunitiesPage({ allCommunities, createdCommunities }: { allCommunities: any[], createdCommunities: any[] }) {
    const [activeTab, setActiveTab] = useState('discover');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [pending, startTransition] = useTransition();

    const router = useRouter();


    const categories = ['all', 'Technology', 'Career', 'Culture', 'Sports'];

    const filteredCommunities = allCommunities.filter(community => {
        const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            community.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory;
        const matchesTab = activeTab === 'discover' ? true :
            activeTab === 'joined' ? community.isMember :
                activeTab === 'created' ? community.isCreated : true;

        return matchesSearch && matchesCategory && matchesTab;
    });

    function handleJoinLeave(communityId: string, isCurrentlyJoined: boolean) {
        startTransition(async () => {
            try {
                console.log("handling join leave for", communityId, "currently joined:", isCurrentlyJoined);
                const result = await joinLeaveCommunity(communityId, !isCurrentlyJoined);

                const communityIndex = allCommunities.findIndex(c => c.id === communityId);
                if (communityIndex !== -1) {
                    allCommunities[communityIndex].isJoined = !isCurrentlyJoined;
                }
            } catch (error) {
                console.error("Error joining/leaving community:", error);
            }
        });
    }


    const joinedCommunities = allCommunities.filter(c => c.isMember);

    function handleCreate() {
        router.push("/communities/create")
    }


    const CommunityCard = ({ community }: any) => {
        const [isJoined, setIsJoined] = useState(community.isMember);

        const handleButtonClick = () => {
            handleJoinLeave(community.id, isJoined);
            setIsJoined(!isJoined); // Toggle the button text locally
        };

        return (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                {/* Cover Header */}
                <div className={`h-32 bg-linear-to-r from-blue-500 to-purple-600 relative`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    {(community.isMember && !community.isCreated) && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                            <TrendingUp className="w-4 h-4 text-orange-500" />
                            <span>Member</span>
                        </div>
                    )}
                    {community.isCreated && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                            <TrendingUp className="w-4 h-4 text-orange-500" />
                            <span>Owner</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                                {community.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <MapPin className="w-4 h-4" />
                                <span>{community.universityId ? community.universityId : "Amrita "}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {community.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">{community._count.members}</span>
                            <span className="text-gray-500">members</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">{community.upcomingEvents | 0}</span>
                            <span className="text-gray-500">events</span>
                        </div>
                    </div>

                    {/* Category Badge */}
                    <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {community.category ? community.category : "Technology"}
                        </span>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium flex items-center gap-1 cursor-pointer"
                                onClick={() => router.push(`/c/${community.id}`)}>
                                View
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleButtonClick}
                                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium cursor-pointer ${isJoined
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }`}
                            >
                                {isJoined ? 'Leave' : 'Join'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Header */}
            <div className="bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 text-white">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-8 h-8" />
                        <h1 className="text-5xl font-bold">Communities</h1>
                    </div>
                    <p className="text-xl text-white/90 max-w-2xl">
                        Discover and join communities to stay connected with events, placements, and campus activities
                    </p>

                    {/* Quick Stats */}
                    <div className="flex gap-8 mt-8">
                        <div>
                            <p className="text-3xl font-bold">{allCommunities.length}</p>
                            <p className="text-white/80">Total Communities</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">{joinedCommunities.length}</p>
                            <p className="text-white/80">Joined</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">{allCommunities.filter(c => c.isTrending).length}</p>
                            <p className="text-white/80">Trending Now</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Tabs and Search Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        {/* Tabs */}
                        <div className="flex gap-2 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('discover')}
                                className={`px-6 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all ${activeTab === 'discover'
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Discover All
                            </button>
                            <button
                                onClick={() => setActiveTab('joined')}
                                className={`px-6 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'joined'
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <CheckCircle className="w-4 h-4" />
                                Joined Communities ({joinedCommunities.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('created')}
                                className={`px-6 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'created'
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <TrendingUp className="w-4 h-4" />
                                My Communities
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search communities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Filter by:</span>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category
                                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                                    }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{filteredCommunities.length}</span> communities
                        {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                </div>

                {/* Communities Grid */}
                {filteredCommunities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCommunities.map((community) => (
                            <CommunityCard key={community.id} community={community} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No communities found</h3>
                        <p className="text-gray-600">
                            {searchQuery
                                ? `No communities match "${searchQuery}". Try a different search term.`
                                : 'No communities available in this category.'}
                        </p>
                    </div>
                )}

                {/* Create Community CTA */}
                <div className="mt-12 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-8 text-center">
                    <div className="max-w-2xl mx-auto">
                        <Star className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Don't see your community?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Create a new community for your club, department, or interest group and start connecting with others!
                        </p>
                        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2 mx-auto" onClick={handleCreate}>
                            <Plus className="w-5 h-5" />
                            Create Community
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}