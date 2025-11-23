"use client";

import { useState } from "react";
import { expireTime, timeAgo } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, TrendingUp } from "lucide-react";

export default function PollDisplay({
    post,
    votePollAction,
}: {
    post: any;
    votePollAction: (postId: string, optionId: string) => Promise<any>;
}) {
    const isExpired = post.expiresAt && new Date(post.expiresAt) < new Date();
    const [userVote, setUserVote] = useState<string | null>(post.userVoteOptionId || null);
    const [voting, setVoting] = useState(false);
    const [pollOptions, setPollOptions] = useState(post.pollOptions);

    const totalVotes = pollOptions.reduce((sum: number, opt: any) => sum + opt.voteCount, 0);

    const handleVote = async (optionId: string) => {
        if (isExpired) {
            console.warn("Poll expired — cannot vote.");
            return;
        }

        if (optionId === userVote) {
            return;
        }

        setVoting(true);

        const result = await votePollAction(post.id, optionId);

        if (result.success) {
            const newOptionId = result.votedOptionId;
            const oldOptionId = userVote;
            setUserVote(newOptionId);

            setPollOptions((prev: any) =>
                prev.map((opt: any) => {
                    if (opt.id === newOptionId) {
                        return { ...opt, voteCount: opt.voteCount + 1 };
                    }
                    if (oldOptionId && opt.id === oldOptionId) {
                        return { ...opt, voteCount: opt.voteCount - 1 };
                    }
                    return opt;
                })
            );
        } else {
            console.error("Vote failed:", result.error);
        }

        setVoting(false);
    };

    if (!isExpired) {
        return (
            <div className="space-y-3">
                <AnimatePresence>
                    {pollOptions.map((opt: any, idx: number) => {
                        const isUserPick = opt.id === userVote;
                        const percent = totalVotes ? Math.round((opt.voteCount / totalVotes) * 100) : 0;

                        return (
                            <motion.button
                                key={opt.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={voting || isExpired}
                                onClick={() => handleVote(opt.id)}
                                className={`relative w-full p-4 rounded-xl text-left transition-all duration-300 overflow-hidden
                                    ${isUserPick
                                        ? "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-500/20"
                                        : "bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 hover:bg-white dark:hover:bg-black/30 hover:border-blue-300 dark:hover:border-blue-700"
                                    }
                                    ${isExpired ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
                                `}
                            >
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`font-semibold text-sm ${isUserPick ? 'text-blue-700 dark:text-blue-300' : 'text-neutral-800 dark:text-neutral-200'}`}>
                                            {opt.text}
                                        </span>
                                        {isUserPick && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold shadow-lg"
                                            >
                                                Your Vote
                                            </motion.span>
                                        )}
                                    </div>

                                    <div className="relative h-2 bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full overflow-hidden mb-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className={`absolute inset-y-0 left-0 rounded-full ${isUserPick
                                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                    : 'bg-gradient-to-r from-blue-400 to-cyan-400'
                                                }`}
                                        />
                                        {isUserPick && (
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                animate={{ x: ['-100%', '200%'] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            />
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center text-xs">
                                        <span className={`font-bold ${isUserPick ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-600 dark:text-neutral-400'}`}>
                                            {percent}%
                                        </span>
                                        <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {opt.voteCount} {opt.voteCount === 1 ? 'vote' : 'votes'}
                                        </span>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-3 px-1"
                >
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">{expireTime(new Date(post.expiresAt))}</span>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 text-red-700 dark:text-red-300 text-xs font-bold border border-red-300 dark:border-red-700/50 shadow-lg"
            >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Poll Closed
            </motion.div>

            <AnimatePresence>
                {pollOptions.map((opt: any, idx: number) => {
                    const percent = totalVotes ? Math.round((opt.voteCount / totalVotes) * 100) : 0;
                    const isUserPick = opt.id === userVote;
                    const isLeading = pollOptions.every((o: any) => o.id === opt.id || opt.voteCount >= o.voteCount);

                    return (
                        <motion.div
                            key={opt.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative w-full p-4 rounded-xl overflow-hidden
                                ${isUserPick
                                    ? "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-400 dark:border-blue-500"
                                    : "bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50"
                                }
                            `}
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`font-semibold text-sm ${isUserPick ? 'text-blue-700 dark:text-blue-300' : 'text-neutral-800 dark:text-neutral-200'}`}>
                                        {opt.text}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {isUserPick && (
                                            <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold">
                                                You
                                            </span>
                                        )}
                                        {isLeading && opt.voteCount > 0 && (
                                            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-lg">
                                                Leading
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="relative h-3 bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full overflow-hidden mb-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percent}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`absolute inset-y-0 left-0 rounded-full ${isLeading && opt.voteCount > 0
                                                ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                                : isUserPick
                                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                    : 'bg-gradient-to-r from-neutral-400 to-neutral-500'
                                            }`}
                                    />
                                </div>

                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-neutral-700 dark:text-neutral-300">
                                        {percent}%
                                    </span>
                                    <span className="text-neutral-500 dark:text-neutral-400">
                                        {opt.voteCount} {opt.voteCount === 1 ? 'vote' : 'votes'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50"
            >
                Total votes: {totalVotes}
            </motion.div>
        </div>
    );
}
