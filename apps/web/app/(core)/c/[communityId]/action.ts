"use server";

import { cookies } from "next/headers";

export async function getAllPosts(communityId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session");
    const uID = cookieStore.get("uID");

    const res = await fetch(`http://localhost:3003/api/posts/${communityId}/posts/community`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "uid": `${uID?.value}`,
            "Cookie": `session=${token?.value}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch posts");
    }

    const postData = await res.json();;

    const authorIds = [...new Set(postData.posts.map((p: any) => p.authorId))];
    const communityIds = [...new Set(postData.posts.map((p: any) => p.communityId))];


    if (communityIds.length === 0) {
        return [];
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
        authorName: userMap[post.authorId]?.username || "Unknown User",
        authorImage: userMap[post.authorId]?.profileImageUrl,
        communityName: communityMap[post.communityId]?.displayName || "Public",
    }));

    console.log("Enriched Posts:", enrichedPosts);

    return enrichedPosts;
}


export async function getCommunityDetails(communityId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session");
    const uID = cookieStore.get("uID");

    const res = await fetch(`http://localhost:3002/api/community/${communityId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "uid": `${uID?.value}`,
            "Cookie": `session=${token?.value}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch community details");
    }

    const data = await res.json();
    console.log("comm", data)
    return data.community;
}


export async function checkMembership(communityId: string) {
    const cookieStore = await cookies();
    const tokenObj = cookieStore.get("session");
    const uidObj = cookieStore.get("uid");

    const token = tokenObj?.value;
    const uid = uidObj?.value;
    if (!token || !uid) {
        throw new Error("no token or uni id")
    }

    const res = await fetch(`http://localhost:3002/api/community/${communityId}/membership-status`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${token}; uid=${uid}`,
        },
    })

    if (!res.ok) {
        throw new Error("membership check failed")
    }

    const data = await res.json();

    return data.isMember;
}



export async function checkCreatorStatus(communityId: string) {
    const cookieStore = await cookies();
    const tokenObj = cookieStore.get("session");
    const uidObj = cookieStore.get("uid");

    const token = tokenObj?.value;
    const uid = uidObj?.value;
    if (!token || !uid) {
        throw new Error("no token or uni id")
    }

    const res = await fetch(`http://localhost:3002/api/community/${communityId}/created`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${token}; uid=${uid}`,
        },
    })

    if (!res.ok) {
        throw new Error("membership check failed")
    }

    const data = await res.json();

    return data.isCreator;
}