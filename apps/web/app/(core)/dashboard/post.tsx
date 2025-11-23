"use client";
import { timeAgo } from "@/lib/utils";
import { BarChart3, Bookmark, Heart, ImageIcon, MessageSquare, MoreHorizontal, Share2, Video, X } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import PollDisplay from "./PollDisplay";
import { voteOnPoll } from "./action";
import { motion } from "framer-motion";

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
    const [isLikedState, setIsLikedState] = useState(post.votes.some((like: any) => like.userId === userId));
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleVote = async (postId: string, voteType: "UPVOTE" | "DOWNVOTE") => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_POST_SERVICE}/api/posts/${postId}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ voteType }),
            });
            const data = await res.json();

            if (res.ok) {
                if (data.message === "Vote removed") {
                    setLikesCount((prev: any) => prev - 1);
                    setIsLikedState(false);
                } else if (data.message === "Vote created") {
                    setLikesCount((prev: any) => prev + 1);
                    setIsLikedState(true);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white/70 dark:bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-xl shadow-black/5 overflow-hidden hover:shadow-2xl hover:shadow-black/10 transition-all duration-300"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative"
                        >
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-cyan-400 p-0.5">
                                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-neutral-900">
                                    {post.authorImage ? (
                                        <Image
                                            src={post.authorImage}
                                            alt={post.authorName}
                                            width={1024}
                                            height={1024}
                                            className="rounded-full object-cover w-full h-full"
                                        />
                                    ) : (
                                        <Image
                                            src={"/avatar.jpg"}
                                            alt={post.authorName}
                                            width={1024}
                                            height={1024}
                                            className="rounded-full object-cover w-full h-full"
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-neutral-800 dark:text-white">{post.authorName}</span>
                                <span className="text-xs text-neutral-400 dark:text-neutral-500">•</span>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">{timeAgo(new Date(post.createdAt).toDateString())}</span>
                            </div>
                            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">{post.communityName ? post.communityName : "Public"}</span>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 hover:bg-neutral-100/80 dark:hover:bg-neutral-700/50 rounded-xl transition-all duration-200"
                    >
                        <MoreHorizontal className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                    </motion.button>
                </div>

                <p className="text-neutral-800 dark:text-neutral-200 mb-4 leading-relaxed text-[15px]">{post.content}</p>

                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag: string, idx: number) => (
                            <motion.span
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                className="px-3 py-1.5 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20
                                    text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full
                                    border border-blue-200/50 dark:border-blue-700/30 hover:border-blue-300 dark:hover:border-blue-600
                                    cursor-pointer transition-all duration-200 shadow-sm"
                            >
                                #{tag}
                            </motion.span>
                        ))}
                    </div>
                )}

                {post.imageUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: imageLoaded ? 1 : 0 }}
                        className="relative mb-4 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800"
                    >
                        <Image
                            src={post.imageUrl}
                            alt="post image"
                            width={1024}
                            height={1024}
                            onLoad={() => setImageLoaded(true)}
                            className="w-full h-auto rounded-xl object-cover"
                        />
                    </motion.div>
                )}

                {post.type === "POLL" && (
                    <div className="mb-4">
                        <PollDisplay post={post} votePollAction={voteOnPoll} />
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 mt-2 border-t border-neutral-200/50 dark:border-neutral-700/50">
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all duration-200 group"
                            onClick={() => handleVote(post.id, "UPVOTE")}
                        >
                            <motion.div
                                animate={isLikedState ? { scale: [1, 1.3, 1] } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                <Heart
                                    className={`w-5 h-5 transition-all duration-200 ${isLikedState ? 'fill-red-500 text-red-500' : ''}`}
                                />
                            </motion.div>
                            <span className="text-sm font-semibold">{likesCount || 0}</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-all duration-200"
                            onClick={() => handleView(post.id)}
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-sm font-semibold">{post.comments?.length || 0}</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-500 transition-all duration-200"
                        >
                            <Share2 className="w-5 h-5" />
                            <span className="text-sm font-semibold">{post.shares || 0}</span>
                        </motion.button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 text-neutral-600 dark:text-neutral-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-500 rounded-xl transition-all duration-200"
                    >
                        <Bookmark className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
export default PostCard;