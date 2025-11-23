"use server"

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getCommunities() {

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("session");

    if (!tokenCookie) {
        return { success: false, error: "Authentication session not found." };
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_COMMUNITY_SERVICE}/api/community/user/communities`, {
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${tokenCookie.value}`
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch communities');
    }
    const comm = await res.json();

    return comm.communities;
}


export async function getAllPosts() {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("session");
    const uid = cookieStore.get("uid");

    if (!tokenCookie || !uid) {
        return { success: false, error: "Authentication session or university id not found." };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_POST_SERVICE}/api/posts/${uid.value}/posts`, {
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

    const authorIds = [...new Set(postData.posts.map((p: any) => p.authorId))];
    const communityIds = [...new Set(postData.posts.map((p: any) => p.communityId))];

    if (communityIds.length === 0) {
        return [""];
    }

    const [usersRes, communitiesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/bulk`, {
            method: "POST",
            body: JSON.stringify({ ids: authorIds }),
            headers: { "Content-Type": "application/json" }
        }),
        fetch(`${process.env.NEXT_PUBLIC_COMMUNITY_SERVICE}/api/community/bulk`, {
            method: "POST",
            body: JSON.stringify({ ids: communityIds }),
            headers: { "Content-Type": "application/json" }
        })
    ]);



    const { users } = await usersRes.json();
    const { communities } = await communitiesRes.json();

    const userMap = users.reduce((acc: any, user: any) => {
        acc[user.id] = user;
        return acc;
    }, {});

    const communityMap = communities.reduce((acc: any, comm: any) => {
        acc[comm.id] = comm;
        return acc;
    }, {});


    const enrichedPosts: any[] = postData.posts.map((post: any) => ({
        ...post,
        authorName: userMap[post.authorId]?.name || "Unknown User",
        authorImage: userMap[post.authorId]?.profileImageUrl,
        communityName: communityMap[post.communityId]?.name || "Public",
    }));


    return enrichedPosts;
}

export async function createPost(data: any) {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("session");
    const uid = cookieStore.get("uid");

    if (!tokenCookie || !uid) {
        return { success: false, error: "Authentication session or university id not found." };
    }

    const payload = {
        ...data,
        universityId: uid.value,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_POST_SERVICE}/api/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${tokenCookie.value}`
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create post');
    }
    const postData = await res.json();
    revalidatePath("/dashboard");
}

export async function sendImageToBackend(imageUrl: string) {
    try {
        // This is your Express backend endpoint
        const backendUrl = `${process.env.NEXT_PUBLIC_COMMUNITY_SERVICE}/api/posts`;

        const res = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl }),
        });

        if (!res.ok) {
            throw new Error(`Backend responded with ${res.status}`);
        }

        const data = await res.json();

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

        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/me`, {
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_POST_SERVICE}/api/posts/${postId}/poll/vote`, {
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


export async function getAllUsers() {
    try {

        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("session");
        const uid = cookieStore.get("uid");

        if (!tokenCookie || !uid) {
            return { success: false, error: "Authentication session not found." };
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/${uid.value}/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `session=${tokenCookie.value}`
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch users');
        }
        const userData = await res.json();
        return userData.users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

