"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getAllComunities() {
    const cookieStore = await cookies();
    const tokenObj = cookieStore.get("session");
    const uidObj = cookieStore.get("uid");

    const token = tokenObj?.value;
    const uid = uidObj?.value;


    if (!token || !uid) {
        throw new Error("no token or uni id")
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_COMMUNITY_SERVICE}/api/community/university`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${token}; uid=${uid}`,
        },
    })



    if (!res.ok) {
        throw new Error("commm did not find by university")
    }

    const data = await res.json();

    return data;

}


export async function getAllUserCommunities() {
    const cookieStore = await cookies();
    const tokenObj = cookieStore.get("session");
    const uidObj = cookieStore.get("uid");

    const token = tokenObj?.value;
    const uid = uidObj?.value;
    if (!token || !uid) {
        throw new Error("no token or uni id")
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_COMMUNITY_SERVICE}/api/community/user/communities`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${token}; uid=${uid}`,
        },
    })
    if (!res.ok) {
        throw new Error("commm did not find by user")
    }

    const data = await res.json();

    return data;
}


export async function joinLeaveCommunity(communityId: string, isJoining: boolean) {
    const cookieStore = await cookies();
    const tokenObj = cookieStore.get("session");
    const uidObj = cookieStore.get("uid");

    const token = tokenObj?.value;
    const uid = uidObj?.value;
    if (!token || !uid) {
        throw new Error("no token or uni id")
    }

    const method = isJoining ? 'POST' : 'DELETE'; // POST for join, DELETE for leave
    const res = await fetch(`${process.env.NEXT_PUBLIC_COMMUNITY_SERVICE}/api/community/${communityId}/join-leave`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${token}; uid=${uid}`,
        },
    })
    if (!res.ok) {
        throw new Error(isJoining ? "could not join community" : "could not leave community");
    }

    const data = await res.json();
    revalidatePath('/dashboard');
}


export async function getCreatedCommunities() {
    const cookieStore = await cookies();
    const tokenObj = cookieStore.get("session");
    const uidObj = cookieStore.get("uid");

    const token = tokenObj?.value;
    const uid = uidObj?.value;
    if (!token || !uid) {
        throw new Error("no token or uni id")
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_COMMUNITY_SERVICE}/api/community/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${token}; uid=${uid}`,
        },
    })
    if (!res.ok) {
        throw new Error("could not fetch created communities");
    }

    const data = await res.json();
    return data;
}