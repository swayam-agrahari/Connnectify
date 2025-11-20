"use client";
import { PREDEFINED_TAGS } from "@/lib/constants";
import { BarChart3, X } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";

export const CreatePostModal = ({
    userInfo,
    setNewPost,
    setShowCreatePost,
    newPost,
    handleCreatePost,
    communities,
    handleImageUpload,
    forceCommunityId
}: {
    userInfo: any;
    setNewPost: any;
    setShowCreatePost: any;
    newPost: any;
    handleCreatePost: any;
    communities: any[];
    handleImageUpload: any;
    forceCommunityId?: string;
}) => {

    const [postType, setPostType] = useState<"TEXT" | "IMAGE" | "POLL">("TEXT");
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const [pollDuration, setPollDuration] = useState(1);

    // TAG STATES
    const [tagQuery, setTagQuery] = useState("");
    const [showTagOptions, setShowTagOptions] = useState(false);
    const tags: string[] = Array.isArray(newPost.tags) ? newPost.tags : [];

    /** ---------------------- POLL HANDLING ---------------------- **/
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
            communityId: null,
            imageUrl: "",
            tags: [],
        });
    };

    /** ---------------------- SUBMIT HANDLER ---------------------- **/
    const handleSubmit = async () => {
        const payload: any = {
            content: newPost.content,
            type: postType,
            communityId: forceCommunityId ?? newPost.communityId,
            imageUrl: newPost.imageUrl || undefined,
            tags: tags,
        };

        if (postType === "POLL") {
            payload.poll = {
                options: pollOptions.filter(o => o.trim()),
                duration: pollDuration,
            };
        }

        await handleCreatePost(payload);
        resetForm();
    };

    /** ---------------------- TEXTAREA TAG DETECTION ---------------------- **/
    const replaceLastHashtag = (text: string, finalTag: string) => {
        return text.replace(/#\w*$/, `#${finalTag} `);
    };

    const handleContentChange = (e: any) => {
        const value = e.target.value;
        setNewPost({ ...newPost, content: value });

        const lastChar = value[value.length - 1];
        const lastWord = value.split(" ").pop();

        if (lastChar === "#") {
            setTagQuery("");
            setShowTagOptions(true);
            return;
        }

        if (showTagOptions) {
            const q = lastWord?.replace("#", "") ?? "";
            setTagQuery(q);
        }
    };

    /** --------------------------- UI --------------------------- **/
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

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl">
                            {userInfo.profileImageUrl ? (
                                <Image
                                    src={userInfo.profileImageUrl}
                                    alt={userInfo.name}
                                    width={1024}
                                    height={1024}
                                    className="rounded-full object-cover w-10 h-10"
                                />
                            ) : (
                                <span className="text-white font-semibold">
                                    {userInfo.name
                                        .split(" ")
                                        .map((n: string) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <p className="font-medium text-neutral-800 dark:text-white">
                                {userInfo.name}
                            </p>

                            {/* Show community only if not forced */}
                            {forceCommunityId ? (
                                <p className="text-sm text-neutral-500">
                                    Posting in{" "}
                                    <strong>
                                        {communities?.find(c => c.id === forceCommunityId)?.name}
                                    </strong>
                                </p>
                            ) : (
                                <select
                                    className="text-sm text-neutral-700 dark:text-neutral-300 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg p-1"
                                    value={newPost.communityId || ""}
                                    onChange={(e) =>
                                        setNewPost({ ...newPost, communityId: e.target.value })
                                    }
                                >
                                    <option value="" disabled>Select Community</option>
                                    {communities.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
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
                        onChange={handleContentChange}
                        onKeyDown={(e) => {
                            if (showTagOptions && e.key === "Enter") {
                                e.preventDefault();

                                const bestMatch = PREDEFINED_TAGS.find(t =>
                                    t.toLowerCase().startsWith(tagQuery.toLowerCase())
                                );

                                if (bestMatch) {
                                    const cleanedContent = newPost.content.replace(/#\w*$/, "").trim();

                                    setNewPost({
                                        ...newPost,
                                        content: cleanedContent + " ",
                                        tags: [...tags, bestMatch]
                                    });

                                    setShowTagOptions(false);
                                }
                            }

                        }}
                    />

                    {/* Selected Tags Chips */}
                    {tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
                            {tags.map((tag: string) => (
                                <div
                                    key={tag}
                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
                                >
                                    #{tag}
                                    <button
                                        onClick={() =>
                                            setNewPost({
                                                ...newPost,
                                                tags: tags.filter((t) => t !== tag)
                                            })
                                        }
                                        className="text-blue-700 hover:text-blue-900"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tag Autocomplete */}
                    {showTagOptions && (
                        <div className="mt-2 bg-white border rounded-lg shadow p-2 max-h-40 overflow-y-auto">
                            {PREDEFINED_TAGS
                                .filter(t =>
                                    t.toLowerCase().includes(tagQuery.toLowerCase())
                                )
                                .map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            const cleanedContent = newPost.content.replace(/#\w*$/, "").trim();

                                            setNewPost({
                                                ...newPost,
                                                content: cleanedContent + " ", // continue typing smoothly
                                                tags: [...tags, tag]
                                            });

                                            setShowTagOptions(false);
                                        }}

                                        className="block w-full text-left px-3 py-2 hover:bg-neutral-100 rounded"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                        </div>
                    )}

                    {/* Poll or Upload */}
                    {postType === "POLL" ? (
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Poll Options
                            </p>

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
                                <label className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Duration:
                                </label>
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
