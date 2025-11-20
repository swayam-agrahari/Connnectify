"use client"

import { useState, useTransition } from "react";
import { createPost } from "@/app/(core)/dashboard/action";

export function useCreatePost() {
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [newPost, setNewPost] = useState<any>({
        content: "",
        type: "TEXT",
        communityId: null,
        imageUrl: "",
        tags: [],
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [pending, startTransition] = useTransition();

    async function handleCreatePost(postData: any) {
        startTransition(async () => {
            const res = await createPost(postData);

            if (res?.error) {
                setErrors({ _form: [res.error] });
                return;
            }

            setShowCreatePost(false);
        });
    }

    function handleImageUpload(result: any) {
        const url = result?.info?.secure_url;
        if (!url) return;

        setNewPost((prev: any) => ({
            ...prev,
            type: "IMAGE",
            imageUrl: url,
        }));
    }

    return {
        showCreatePost,
        setShowCreatePost,
        newPost,
        setNewPost,
        handleCreatePost,
        handleImageUpload,
        errors,
        pending
    };
}
