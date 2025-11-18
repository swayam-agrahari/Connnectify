"use client";

import { useState } from "react";
import { expireTime, timeAgo } from "@/lib/utils";

export default function PollDisplay({
    post,
    votePollAction,
}: {
    post: any;
    votePollAction: (postId: string, optionId: string) => Promise<any>;
}) {
    const isExpired = post.expiresAt && new Date(post.expiresAt) < new Date();

    // Local state to track current vote
    const [userVote, setUserVote] = useState<string | null>(post.userVoteOptionId || null);
    const [voting, setVoting] = useState(false);
    const [pollOptions, setPollOptions] = useState(post.pollOptions);

    const totalVotes = pollOptions.reduce((sum: number, opt: any) => sum + opt.voteCount, 0);


    const handleVote = async (optionId: string) => {
        if (isExpired) return;

        // ⛔ Prevent voting again on same option — do nothing
        if (optionId === userVote) {
            return;
        }

        setVoting(true);

        const result = await votePollAction(post.id, optionId);

        if (result.success) {
            const newOptionId = result.votedOptionId;
            const oldOptionId = userVote;

            // Update local vote state
            setUserVote(newOptionId);

            // Update poll options locally
            setPollOptions((prev: any) =>
                prev.map((opt: any) => {
                    if (opt.id === newOptionId) {
                        // Increment new vote
                        return { ...opt, voteCount: opt.voteCount + 1 };
                    }
                    if (oldOptionId && opt.id === oldOptionId) {
                        // Decrement previous vote
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

    // -------------------------
    // STATE A: ACTIVE & NOT EXPIRED
    // -------------------------
    if (!isExpired) {
        return (
            <div className="space-y-2">
                {pollOptions.map((opt: any) => {
                    const isUserPick = opt.id === userVote;
                    const percent = totalVotes ? Math.round((opt.voteCount / totalVotes) * 100) : 0;

                    return (
                        <button
                            key={opt.id}
                            disabled={voting}
                            onClick={() => handleVote(opt.id)}
                            className={`w-full px-4 py-2 rounded-lg border text-left transition-all
                                ${isUserPick
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <span>{opt.text}</span>
                                {isUserPick && <span className="text-xs text-blue-500">Your Vote</span>}
                            </div>
                            <div className="mt-2">
                                <div
                                    className="h-2 rounded bg-blue-500/30 dark:bg-blue-800/40"
                                    style={{ width: `${percent}%` }}
                                ></div>
                                <div className="flex justify-between mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                    <span>{percent}%</span>
                                    <span>{opt.voteCount} votes</span>
                                </div>
                            </div>
                        </button>
                    );
                })}
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {expireTime(new Date(post.expiresAt))}
                </span>
            </div>
        );
    }

    // -------------------------
    // STATE B: EXPIRED
    // -------------------------
    return (
        <div className="space-y-3">
            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                Poll Closed
            </span>

            {pollOptions.map((opt: any) => {
                const percent = totalVotes ? Math.round((opt.voteCount / totalVotes) * 100) : 0;
                const isUserPick = opt.id === userVote;

                return (
                    <div key={opt.id} className="w-full">
                        <div
                            className={`relative w-full rounded-lg p-2 border
                                ${isUserPick
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-neutral-300 dark:border-neutral-700"
                                }
                            `}
                        >
                            <div
                                className="h-2 rounded bg-blue-500/30 dark:bg-blue-800/40"
                                style={{ width: `${percent}%` }}
                            ></div>

                            <div className="flex items-center justify-between mt-2 text-sm">
                                <span className="text-neutral-800 dark:text-neutral-200">
                                    {opt.text}
                                </span>
                                <span className="text-neutral-600 dark:text-neutral-400">
                                    {percent}%
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}

            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Total votes: {totalVotes}
            </span>
        </div>
    );
}