"use client";
import { timeAgo } from "@/lib/utils";
import { BarChart3, Bookmark, Heart, ImageIcon, MessageSquare, MoreHorizontal, Share2, Video, X } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import PollDisplay from "./PollDisplay";
import { voteOnPoll } from "./action";

interface Poll {
    options: string[];
    duration: number;
}

interface Post {
    type: "TEXT" | "IMAGE" | "POLL";
    content: string;
    authorName: string;
    authorImage: string;
    time: string;
    communityName: string;
    tags?: string[];
    imageUrl?: string;
    likes: number;
    comments: number;
    shares: number;

}

function handleView(postId: any) {
    redirect(`/posts/${postId}`);
}




export const CreatePostModal = ({ userInfo,
    setNewPost, setShowCreatePost, newPost,
    handleCreatePost, communities, handleImageUpload
}: any) => {
    const [postType, setPostType] = useState<"TEXT" | "IMAGE" | "POLL">("TEXT");
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const [pollDuration, setPollDuration] = useState(1);

    const updatePollOption = (index: number, value: string) => {
        const updated = [...pollOptions];
        updated[index] = value;
        setPollOptions(updated);
    };

    const addPollOption = () => setPollOptions([...pollOptions, ""]);
    const removePollOption = (index: number) =>
        setPollOptions(pollOptions.filter((_, i) => i !== index));

    const resetForm = () => {
        setPostType("TEXT");
        setPollOptions(["", ""]);
        setPollDuration(1);
        setNewPost({
            content: "",
            visibility: "Public",
            communityId: null,
            imageUrl: "",
            tags: [],
        });
    };

    const handleSubmit = async () => {
        if (postType === "POLL") {
            console.log("Submitting poll post");
            handleCreatePost({
                ...newPost,
                type: "POLL",
                poll: {
                    options: pollOptions.filter((o) => o.trim() !== ""),
                    duration: pollDuration,
                },
            });
        } else {
            await handleCreatePost({ ...newPost, type: postType });
            resetForm();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-4 flex items-center justify-center">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">Create Post</h3>
                    <button
                        onClick={() => setShowCreatePost(false)}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
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
                        <div>
                            <p className="font-medium text-neutral-800 dark:text-white">{userInfo.name}</p>
                            <select
                                className="text-sm text-neutral-600 dark:text-neutral-400 bg-transparent border-none outline-none"
                                value={newPost.visibility}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setNewPost({
                                        ...newPost,
                                        visibility: value,
                                        communityId: value === "Public" ? null : newPost.communityId,
                                    });
                                }}
                            >
                                <option value="Public">Public</option>
                                <option value="Communities Only">Communities Only</option>
                            </select>

                            {newPost.visibility === "Communities Only" && (
                                <select
                                    className="text-sm text-neutral-700 dark:text-neutral-300 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg p-1"
                                    value={newPost.communityId || ""}
                                    onChange={(e) =>
                                        setNewPost({ ...newPost, communityId: e.target.value })
                                    }
                                >
                                    <option value="" disabled>
                                        Select Community
                                    </option>
                                    {communities.map((c: any) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Text Content */}
                    <textarea
                        className="w-full min-h-32 p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:text-white"
                        placeholder="What's on your mind?"
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    />

                    {/* Upload or Poll Options */}
                    {postType === "POLL" ? (
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Poll Options</p>
                            {pollOptions.map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => updatePollOption(idx, e.target.value)}
                                        placeholder={`Option ${idx + 1}`}
                                        className="flex-1 p-2 border border-neutral-300 dark:border-neutral-700 rounded-lg dark:bg-neutral-900 dark:text-white"
                                    />
                                    {pollOptions.length > 2 && (
                                        <button
                                            onClick={() => removePollOption(idx)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addPollOption}
                                className="text-sm text-blue-500 hover:underline"
                            >
                                + Add option
                            </button>

                            <div className="flex items-center gap-2">
                                <label className="text-sm text-neutral-600 dark:text-neutral-400">Duration:</label>
                                <select
                                    className="p-1 border rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
                                    value={pollDuration}
                                    onChange={(e) => setPollDuration(Number(e.target.value))}
                                >
                                    <option value={1}>1 day</option>
                                    <option value={3}>3 days</option>
                                    <option value={7}>7 days</option>
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            <CldUploadButton
                                className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                uploadPreset="connectify_preset"
                                onSuccess={handleImageUpload}
                                options={{ maxFiles: 1 }}
                            >
                                Images
                            </CldUploadButton>

                            <button
                                onClick={() => setPostType("POLL")}
                                className="flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl transition-colors border-neutral-300 dark:border-neutral-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                                <BarChart3 className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium">Poll</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t dark:border-neutral-700">
                    <button
                        className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                        onClick={handleSubmit}
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};


export const PostCard = ({ post, userId }: { post: any, userId: string }) => {

    const [likesCount, setLikesCount] = useState(post.votes?.length || 0);
    const isLiked = post.votes.some((like: any) => like.userId === userId);
    const handleVote = async (postId: string, voteType: "UPVOTE" | "DOWNVOTE") => {
        try {
            const res = await fetch(`http://localhost:3003/api/posts/${postId}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ voteType }),
            });
            const data = await res.json();

            if (res.ok) {
                if (data.message === "Vote removed") {
                    setLikesCount((prev: any) => prev - 1);
                } else if (data.message === "Vote created") {
                    setLikesCount((prev: any) => prev + 1);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };
    return (<div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl">
                        {post.authorImage ? (
                            <Image
                                src={post.authorImage}
                                alt={post.authorName}
                                width={1024}
                                height={1024}
                                className="rounded-full"
                            />
                        ) : (
                            <span className="text-white font-semibold">
                                {post.authorName && post.authorName
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-neutral-800 dark:text-white">{post.authorName}</span>
                            <span className="text-xs text-neutral-500">• {timeAgo(new Date(post.createdAt).toDateString())}</span>
                        </div>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">{post.communityName ? post.communityName : "Public"}</span>
                    </div>
                </div>
                <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </button>
            </div>

            {/* Post Content */}
            <p className="text-neutral-800 dark:text-neutral-200 mb-3">{post.content}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
                {post.tags?.map(({ tag, idx }: any) => (
                    <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full"
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Image */}
            {post.imageUrl && (
                <Image
                    src={post.imageUrl}
                    alt=""
                    width={1024}
                    height={1024}
                    className="w-full h-full rounded-lg mb-3"
                />
            )}

            {/* Poll */}
            {post.type === "POLL" && (
                <div className="mb-3">
                    <PollDisplay post={post} votePollAction={voteOnPoll} />
                </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-red-500 transition-colors"
                        onClick={() => handleVote(post.id, "UPVOTE")}
                    >
                        <Heart className="w-5 h-5" color={isLiked ? "red" : "currentColor"} fill={isLiked ? "red" : "none"} />
                        <span className="text-sm font-medium">{likesCount || 0}</span>
                    </button>

                    <button className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-500 transition-colors" onClick={() => handleView(post.id)}>
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm font-medium">{post.comments?.length | 0}</span>
                    </button>
                    <button className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-green-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-medium">{post.shares | 0}</span>
                    </button>
                </div>
                <button className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 transition-colors">
                    <Bookmark className="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
    );
}