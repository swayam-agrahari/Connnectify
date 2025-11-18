"use server"

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getCommunities() {

    const cookieStore = await cookies();
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

    if (!res.ok) {
        throw new Error('Failed to fetch communities');
    }
    const comm = await res.json();
    console.log("Communities data:", comm);
    return comm.communities;
}


export async function getAllPosts() {
    const cookieStore = await cookies();
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

    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }
    const postData = await res.json();
    console.log("Fetched posts:", postData.posts);

    const authorIds = [...new Set(postData.posts.map((p: any) => p.authorId))];
    const communityIds = [...new Set(postData.posts.map((p: any) => p.communityId))];
    // console.log("Author IDs:", authorIds);
    console.log("Community IDs:", communityIds);

    if (communityIds.length === 0) {
        return [""];
    }

    const [usersRes, communitiesRes] = await Promise.all([
        fetch(`http://localhost:3001/api/auth/bulk`, {
            method: "POST",
            body: JSON.stringify({ ids: authorIds }),
            headers: { "Content-Type": "application/json" }
        }),
        fetch(`http://localhost:3002/api/community/bulk`, {
            method: "POST",
            body: JSON.stringify({ ids: communityIds }),
            headers: { "Content-Type": "application/json" }
        })
    ]);



    const { users } = await usersRes.json();
    const { communities } = await communitiesRes.json();
    // console.log("Fetched users for posts:", users);
    console.log("Fetched communities for posts:", communities);

    const userMap = users.reduce((acc: any, user: any) => {
        acc[user.id] = user;
        return acc;
    }, {});

    const communityMap = communities.reduce((acc: any, comm: any) => {
        acc[comm.id] = comm;
        return acc;
    }, {});
    // console.log("User Map:", userMap);bbb
    console.log("Community Map:", communityMap);



    const enrichedPosts: any[] = postData.posts.map((post: any) => ({
        ...post,
        authorName: userMap[post.authorId]?.username || "Unknown User",
        authorImage: userMap[post.authorId]?.profileImageUrl,
        communityName: communityMap[post.communityId]?.name || "Public",
    }));



    return enrichedPosts;
}

export async function createPost(data: any) {
    const cookieStore = await cookies();
    console.log("cookie", cookieStore)
    const tokenCookie = cookieStore.get("session");

    if (!tokenCookie) {
        return { success: false, error: "Authentication session not found." };
    }

    console.log("Creating post with data:", data);

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
    console.log("Created post data:", postData.post[0]);
    revalidatePath("/dashboard");
}

export async function sendImageToBackend(imageUrl: string) {
    try {
        // This is your Express backend endpoint
        const backendUrl = "http://localhost:3002/api/posts";

        const res = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl }),
        });

        if (!res.ok) {
            throw new Error(`Backend responded with ${res.status}`);
        }

        const data = await res.json();
        console.log("📦 Backend response:", data);

        return data;
    } catch (error) {
        console.error("Error sending image to backend:", error);
        throw error;
    }
}


export async function getUserDetail() {
    try {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("session");

        if (!tokenCookie) {
            return { success: false, error: "Authentication session not found." };
        }

        const res = await fetch("http://localhost:3001/api/auth/me", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `session=${tokenCookie.value}`
            },

        })

        if (!res.ok) {
            console.log("No user found")
            throw new Error("Error finding user")
        }

        const user = await res.json()
        return user;

    } catch (error) {
        console.log("error finding user", error)
    }

}


export async function voteOnPoll(postId: string, pollOptionId: string) {
    try {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("session");

        if (!tokenCookie) {
            return { success: false, error: "Authentication session not found." };
        }
        const res = await fetch(`http://localhost:3003/api/posts/${postId}/poll/vote`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `session=${tokenCookie.value}`
            },
            body: JSON.stringify({ pollOptionId }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Something went wrong while voting");
        }

        // Redirect or update UI based on the response
        revalidatePath("/posts/" + postId);
        return {
            success: true,
            votedOptionId: data.votedOptionId,
        };
    } catch (error) {
        console.error("Error casting vote:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "An unknown error occurred" };
    }
}