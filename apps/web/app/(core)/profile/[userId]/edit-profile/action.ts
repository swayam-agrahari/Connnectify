"use server";

import { cookies } from "next/headers";

export async function getUserDetails() {
    try {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("session");

        if (!tokenCookie) {
            return { success: false, error: "Authentication session not found." };
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/details`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `session=${tokenCookie.value}`
            },
            credentials: "include",

        })

        if (!res.ok) {
            throw new Error("Failed to fetch user details");
        }

        const data = await res.json();
        console.log("User details fetched:", data);
        return data.user;
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
    }
}

export async function updateUserDetails(updatedData: any) {
    try {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("session");

        if (!tokenCookie) {
            return { success: false, error: "Authentication session not found." };
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/api/auth/details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `session=${tokenCookie.value}`
            },
            credentials: "include",
            body: JSON.stringify(updatedData),
        });

        if (!res.ok) {
            throw new Error("Failed to update user details");
        }

        const data = await res.json();
        console.log("User details updated:", data);
        return data.user;
    } catch (error) {
        console.error("Error updating user details:", error);
        throw error;
    }
}

export async function getUniversityName(universityId: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_COMMUNITY_SERVICE}/api/university/${universityId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch university name");
        }

        const data = await res.json();
        console.log("University data fetched:", data);
        return data.name;
    } catch (error) {
        console.error("Error fetching university name:", error);
        throw error;
    }
}