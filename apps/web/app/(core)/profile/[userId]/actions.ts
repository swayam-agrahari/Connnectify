'use server'

import { cookies } from "next/headers";

export async function getUserProfile(userId: string) {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("session");

    if (!tokenCookie) {
        return { success: false, error: "Authentication session not found." };
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/${userId}/details`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${tokenCookie.value}`
        },
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch user profile");
    }
    const data = await response.json();
    return data.user;
}

export async function getUserPosts(userId: string) {
    console.log("Fetching posts for userId:", userId);
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("session");

    if (!tokenCookie) {
        return { success: false, error: "Authentication session not found." };
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_POST_SERVICE}/api/posts/user/${userId}/posts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${tokenCookie.value}`
        },
        credentials: "include",
    });
    const data = await response.json();
    return data.posts;
}

export async function togglePostLike(postId: string, userId: string) {
    const response = await fetch(`${process.env.BACKEND_API_URL}/posts/${postId}/like`, {
        method: 'POST',
        body: JSON.stringify({ userId })
    });
    return response.json();
}

export async function getUserStats(userId: string) {
    // Run all 3 requests at the same time (Parallel fetching)
    const [postRes, communityRes] = await Promise.all([
        // 1. Get Post Count
        fetch(`${process.env.NEXT_PUBLIC_POST_SERVICE}/api/posts/user/${userId}/count`, { cache: 'no-store' }),

        // 2. Get Community Count
        fetch(`${process.env.NEXT_PUBLIC_COMMUNITY_SERVICE}/api/community/user/${userId}/count`, { cache: 'no-store' }),

    ]);

    const posts = await postRes.json();
    const communities = await communityRes.json();

    return {
        posts: posts.count,
        communities: communities.count,
    };
}
