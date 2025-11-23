"use client";

import { useState } from "react";

export default function CommentInput({ postId, replyTo, cancelReply }: { postId: string, replyTo?: any, cancelReply?: () => void }) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit() {
        if (!text.trim()) return;

        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_POST_SERVICE}/api/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    text,
                    parentId: replyTo?.id ?? null, // send parentId if replying
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                console.error("Error submitting comment:", error);
                throw new Error(error.error || "Failed to submit comment");
            }

            setText("");
            cancelReply?.(); // reset reply if there was one
            window.location.reload(); // you can later update state instead

        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-6 mb-6">
            {replyTo && (
                <div className="mb-2 text-sm text-neutral-500">
                    Replying to {replyTo.author.name}{" "}
                    <button onClick={cancelReply} className="text-blue-600">Cancel</button>
                </div>
            )}

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 rounded-lg border dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
            />

            <button
                onClick={submit}
                disabled={loading}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                {loading ? "Posting..." : "Post Comment"}
            </button>
        </div>
    );
}
