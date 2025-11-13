"use server"

import { cookies } from "next/headers";

export async function getCommunities() {

    const cookieStore = await cookies();
    console.log("cookie", cookieStore)
    const tokenCookie = cookieStore.get("session");

    if (!tokenCookie) {
        return { success: false, error: "Authentication session not found." };
    }
    const res = await fetch(`http://localhost:3002/api/community/user/communities`, {
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${tokenCookie.value}`
        },
    });

    console.log("Response from verify endpoint:", res);
    if (!res.ok) {
        throw new Error('Failed to fetch communities');
    }
    const comm = await res.json();
    console.log("Communities data:", comm);
    return comm.communities;
}


export async function getAllPosts() {
    const cookieStore = await cookies();
    console.log("cookie", cookieStore)
    const tokenCookie = cookieStore.get("session");

    if (!tokenCookie) {
        return { success: false, error: "Authentication session not found." };
    }

    const res = await fetch(`http://localhost:3003/api/posts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${tokenCookie.value}`
        },
    });

    console.log("Response from posts endpoint:", res);
    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }
    const postsData = await res.json();
    console.log("Posts data:", postsData);
    return postsData.posts;
}

export async function createPost(data: any) {
    const cookieStore = await cookies();
    console.log("cookie", cookieStore)
    const tokenCookie = cookieStore.get("session");

    if (!tokenCookie) {
        return { success: false, error: "Authentication session not found." };
    }

    const res = await fetch(`http://localhost:3003/api/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${tokenCookie.value}`
        },
        body: JSON.stringify(data),
    });

    console.log("Response from create post endpoint:", res);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create post');
    }
    const postData = await res.json();
    console.log("Created post data:", postData);
    return postData.post;
}   