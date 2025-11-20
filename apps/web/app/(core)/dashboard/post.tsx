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
                                className="rounded-full object-cover w-10 h-10"
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
                {post.tags?.map((tag: string) => (
                    <span
                        key={tag}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 
                   text-blue-600 dark:text-blue-400 text-xs 
                   font-medium rounded-full"
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
                    className="w-full h-full rounded-lg object-cover w-10 h-10 mb-3"
                />
            )}

            {/* Poll */}
            {post.type === "POLL" && (
                <div className="mb-3">
                    <PollDisplay post={post} votePollAction={voteOnPoll}  />
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