"use client";

import Image from "next/image";
import CommentThread from "./CommentThread";
import CommentInput from "./CommentInput";
import { timeAgo } from "@/lib/utils";
import PollDisplay from "../../dashboard/PollDisplay";
import { voteOnPoll } from "../../dashboard/action";
import { Heart, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function FullPost({ post, userId }: { post: any, userId: string }) {
    const [isLiked, setIsLiked] = useState(post.votes.some((like: any) => like.userId === userId));

    const handleLike = () => {
        // Here you can call your backend API to like/unlike the post
        setIsLiked((prev: any) => !prev);
    };

    const totalVotes = post.pollOptions?.reduce(
        (sum: number, opt: any) => sum + opt.voteCount,
        0
    ) || 0;

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 space-y-6 max-w-3xl mx-auto">
            {/* Author Info */}
            <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl">
                    {post.author?.profileImageUrl ? (
                        <Image
                            src={post.author.profileImageUrl}
                            alt={post.author.name}
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
                    <div className="font-semibold text-neutral-900 dark:text-white">
                        {post.author.name}
                    </div>
                    <div className="text-neutral-500 text-sm">
                        {timeAgo(new Date(post.createdAt))}
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <p className="text-neutral-800 dark:text-neutral-200 text-lg whitespace-pre-line">
                {post.content}
            </p>

            {/* Post Image */}
            {post.imageUrl && (
                <Image
                    src={post.imageUrl}
                    width={1024}
                    height={1024}
                    alt="Post image"
                    className="rounded-lg w-full max-h-[500px] object-cover"
                />
            )}
            
            {/* Poll Section */}
            {post.type === "POLL" && post.pollOptions?.length > 0 && (
                <div className="mt-4">
                    <PollDisplay post={post} votePollAction={voteOnPoll} />
                </div>
            )}

            {/* Tags */}
            {post.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                    {post.tags.map((tag: string, i: number) => (
                        <span
                            key={i}
                            className="text-xs px-3 py-1 bg-neutral-200 dark:bg-neutral-700 rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Stats (Likes & Comments Count) */}
            <div className="flex gap-4 mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1 cursor-pointer" onClick={handleLike}>
                    <Heart
                        className="w-5 h-5"
                        color={isLiked ? "red" : "currentColor"}
                        fill={isLiked ? "red" : "none"}
                    />
                    {post.votes?.length || 0} {post.votes?.length === 1 ? "Like" : "Likes"}
                </span>
                <span className="flex items-center gap-1 cursor-pointer">
                    <MessageSquare className="w-5 h-5" />
                    {post.comments?.length || 0} {post.comments?.length === 1 ? "Comment" : "Comments"}
                </span>
            </div>

            {/* Comment Input */}
            <CommentInput postId={post.id} />

            {/* Comment Thread */}
            <CommentThread
                comments={post.comments.filter((c: any) => !c.parentId)}
                postId={post.id}
                allComments={post.comments}
            />
        </div>
    );
}
