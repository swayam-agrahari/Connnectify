"use client";
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Search, Filter, ChevronRight, Star, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

const mockEvents = [
    {
        id: '1',
        title: 'AI & Machine Learning Workshop',
        description: 'Join us for an intensive workshop covering the latest in AI and ML technologies, perfect for beginners and intermediate learners.',
        community: { name: 'Computer Science Club', id: 'cs1' },
        date: '2025-11-25T14:00:00',
        location: 'Engineering Building, Room 301',
        attendees: 45,
        maxAttendees: 60,
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        category: 'Workshop',
        isFeatured: true
    },
    {
        id: '2',
        title: 'Photography Masterclass',
        description: 'Learn professional photography techniques from award-winning photographers. Bring your camera!',
        community: { name: 'Photography Club', id: 'photo1' },
        date: '2025-11-28T10:00:00',
        location: 'Arts Building, Studio A',
        attendees: 28,
        maxAttendees: 30,
        imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
        category: 'Workshop',
        isFeatured: false
    },
    {
        id: '3',
        title: 'Startup Pitch Competition',
        description: 'Watch student entrepreneurs pitch their innovative ideas to industry experts and investors.',
        community: { name: 'Entrepreneurship Society', id: 'ent1' },
        date: '2025-11-30T18:00:00',
        location: 'Business School Auditorium',
        attendees: 120,
        maxAttendees: 200,
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U3RhcnR1cCUyMFBpdGNoJTIwQ29tcGV0aXRpb258ZW58MHx8MHx8fDA%3D',
        category: 'Competition',
        isFeatured: true
    },
    {
        id: '4',
        title: 'Poetry Open Mic Night',
        description: 'Share your original poetry or enjoy performances from talented student poets in a cozy setting.',
        community: { name: 'Creative Writing Circle', id: 'write1' },
        date: '2025-12-02T19:00:00',
        location: 'Student Union Café',
        attendees: 15,
        maxAttendees: 40,
        imageUrl: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800',
        category: 'Social',
        isFeatured: false
    },
    {
        id: '5',
        title: 'Hackathon 2025',
        description: '24-hour coding marathon with prizes, mentorship, and networking opportunities. Form teams or join solo!',
        community: { name: 'Tech Innovators', id: 'tech1' },
        date: '2025-12-05T09:00:00',
        location: 'Innovation Lab',
        attendees: 89,
        maxAttendees: 100,
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        category: 'Competition',
        isFeatured: true
    },
    {
        id: '6',
        title: 'Mental Health Awareness Talk',
        description: 'Important discussion about student mental health with professional counselors and peer support.',
        community: { name: 'Student Wellness', id: 'well1' },
        date: '2025-12-08T16:00:00',
        location: 'Health Center Auditorium',
        attendees: 55,
        maxAttendees: 80,
        imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
        category: 'Talk',
        isFeatured: false
    }
];

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [events] = useState(mockEvents);

    const router = useRouter();

    const categories = ['All', 'Workshop', 'Competition', 'Social', 'Talk'];

    const featuredEvents = events.filter(e => e.isFeatured);
    const upcomingEvents = events.filter(e => !e.isFeatured);

    const filteredEvents = upcomingEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.community.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getAttendancePercentage = (attendees: number, max: number) => {
        return Math.round((attendees / max) * 100);
    };

    function handleClick(eventId: string) {
        router.push(`/events/${eventId}`);
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Hero Section */}
            <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                            Discover Campus Events
                        </h1>
                        <p className="text-lg text-purple-100 max-w-2xl mx-auto mb-8">
                            Join exciting events hosted by communities across campus. Connect, learn, and grow together!
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search events, communities, or topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-0 ring-1 ring-white text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-purple-300 outline-none shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Category Filter */}
                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
                    <Filter className="w-5 h-5 text-gray-600 shrink-0" />
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${selectedCategory === category
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Featured Events */}
                {featuredEvents.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="w-6 h-6 text-purple-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Featured Events</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {featuredEvents.map(event => (
                                <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100 hover:shadow-xl transition-shadow group">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                                                {event.category}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-sm font-semibold rounded-full flex items-center gap-1">
                                                <TrendingUp className="w-4 h-4" />
                                                Featured
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                            {event.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {event.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-sm text-purple-600 font-medium mb-4">
                                            <Users className="w-4 h-4" />
                                            {event.community.name}
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(event.date)}
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock className="w-4 h-4" />
                                                {formatTime(event.date)}
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                {event.location}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-400 border-2 border-white" />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {event.attendees} going
                                                </span>
                                            </div>

                                            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-1 cursor-pointer" onClick={() => handleClick(event.id)}>
                                                View Details
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upcoming Events */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Upcoming Events
                    </h2>

                    {filteredEvents.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No events found
                            </h3>
                            <p className="text-gray-600">
                                Try adjusting your search or filter to find more events
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map(event => (
                                <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group">
                                    <div className="relative h-40 overflow-hidden">
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full">
                                                {event.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
                                            {event.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {event.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-xs text-purple-600 font-medium mb-3">
                                            <Users className="w-3 h-3" />
                                            {event.community.name}
                                        </div>

                                        <div className="space-y-1.5 mb-3">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(event.date)}
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Clock className="w-3 h-3" />
                                                {formatTime(event.date)}
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-gray-100">
                                            <div className="flex items-center justify-between text-xs mb-2">
                                                <span className="text-gray-600">{event.attendees}/{event.maxAttendees} attendees</span>
                                                <span className="font-medium text-purple-600">{getAttendancePercentage(event.attendees, event.maxAttendees)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-linear-to-r from-purple-600 to-pink-600 h-1.5 rounded-full transition-all"
                                                    style={{ width: `${getAttendancePercentage(event.attendees, event.maxAttendees)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}